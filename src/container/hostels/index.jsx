import { useState, useEffect } from "react";
import RoomCard from "../../components/RoomCard";
import RoomDetail from "../../components/roomDetail";
import filter from "../../assets/icons/filter.png";
import MatrixCard from "../../components/MatrixCard";
import home from "../../assets/icons/home.png";
import searchImg from "../../assets/icons/search.svg";
import { Pagination, Input, Select } from "antd";
import { Upload } from "lucide-react";
import { getAllHostels, getStats, deleteRoom, updateRoomStatus } from "../../services/rooms";
import home1 from "../../assets/icons/home-1.png";
import home2 from "../../assets//icons/home-2.png";
import home3 from "../../assets/icons/home-3.png";
import home4 from "../../assets/icons/home-4.png";
import { openNotification } from "../../network/notification";
import { ENTIRES_PER_PAGE_OPTION } from "../../shared/constant";
import StatusReasonModal, { needsReason } from "../../components/shared/statusReasonModal";
import { RoomCardSkeleton } from "../../components/shared/skeletons";
import { getAllFeature } from "../../services/features";
import { exportToCsv } from "../../utils/exportCsv";

const HOSTEL_EXPORT_COLUMNS = [
  { key: "roomNumber", label: "Bed/Room Number" },
  { key: "roomName", label: "Hostel Name", getValue: (r) => r.roomName || r.roomType?.title || r.type || "" },
  { key: "hotel", label: "Hotel", getValue: (r) => r.hotel?.name || "" },
  { key: "status", label: "Status" },
  { key: "pricePerNight", label: "Price/Night" },
  { key: "bedType", label: "Bed Type" },
];

const SORT_OPTIONS = [
  { label: "Name (A to Z)", value: "ASC" },
  { label: "Name (Z to A)", value: "DESC" },
];

const STATUS_OPTIONS = [
  { label: "Available", value: "available" },
  { label: "Active", value: "active" },
  { label: "Occupied", value: "occupied" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Inactive", value: "inactive" },
  { label: "Booked", value: "booked" },
  { label: "Pending Approval", value: "pending_approval" },
];

const matchesType = (hostel, typeId) => {
  const roomTypeId = hostel.roomType?.id || hostel.roomTypeId || hostel.bedTypeId;
  return String(roomTypeId) === String(typeId);
};

export default function HostelListing() {
  const [hostelTypes, setHostelTypes] = useState([]);
  const [activeType, setActiveType] = useState({ label: "All Hostels", typeId: null });
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [hostelsData, setHostelsData] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(null);
  const [status, setStatus] = useState(null);
  const [reasonModal, setReasonModal] = useState({ open: false, id: null, status: "" });
  const [reason, setReason] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchHostelTypes = async () => {
      try {
        const res = await getAllFeature("ROOM_TYPE");
        const raw = res?.data?.data ?? [];
        const seen = new Set();
        const deduped = raw.filter((f) => {
          const key = f.title?.toLowerCase().replace(/\s+/g, " ").trim();
          const normalized = (key === "one bed room" || key === "single bed") ? "single-bed" : key;
          if (seen.has(normalized)) return false;
          seen.add(normalized);
          return true;
        });
        setHostelTypes([{ label: "All Hostels", typeId: null }, ...deduped.map((f) => ({ label: f.title, typeId: f.id }))]);
      } catch {
        console.error("Failed to load hostel types");
      }
    };
    fetchHostelTypes();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (activeType.typeId === null) {
        res = await getAllHostels(currentPage, itemsPerPage, status, search, sort);
        setHostelsData(res?.data);
      } else {
        const allRes = await getAllHostels(1, 9999, status, search, sort);
        const allHostels = allRes?.data?.data || [];
        const filtered = allHostels.filter((r) => r.isHostel && matchesType(r, activeType.typeId));
        res = {
          data: {
            data: filtered,
            meta: {
              totalItems: filtered.length,
              currentPage: 1,
              itemsPerPage: filtered.length,
            },
          },
        };
        setHostelsData(res.data);
      }

      const currentData = res?.data?.data || [];
      if (currentData.length > 0) setSelectedHostel(currentData[0]);
      else setSelectedHostel(null);
    } catch (err) {
      console.error("Data fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getStats(true);
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, search, activeType, status, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeType, status, sort]);

  useEffect(() => {
    fetchStats();
  }, []);

  const resetFilters = () => {
    setSort(null);
    setStatus(null);
  };

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const res = await getAllHostels(1, 10000, status, search, sort);
      let rows = res?.data?.data || [];
      if (activeType.typeId !== null) {
        rows = rows.filter((r) => r.isHostel && matchesType(r, activeType.typeId));
      }
      if (!rows.length) {
        openNotification("info", "No data to export");
        return;
      }
      exportToCsv({ data: rows, columns: HOSTEL_EXPORT_COLUMNS, fileName: "hostels" });
    } catch {
      openNotification("error", "Failed to export hostels");
    } finally {
      setExporting(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    if (needsReason(newStatus)) {
      setReasonModal({ open: true, id, status: newStatus });
    } else {
      applyStatus(id, newStatus, "");
    }
  };

  const applyStatus = async (id, newStatus, reasonText) => {
    setStatusUpdating(true);
    try {
      await updateRoomStatus(id, newStatus, reasonText);
      openNotification("success", "Status updated");
      fetchData();
      fetchStats();
    } catch {
      openNotification("error", "Failed to update status");
    } finally {
      setStatusUpdating(false);
      setReasonModal({ open: false, id: null, status: "" });
      setReason("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hostel? This will also remove associated bookings.")) {
      try {
        await deleteRoom(id);
        setHostelsData((prev) => ({ ...prev, data: prev.data.filter((h) => h.id !== id) }));
        openNotification("success", "Hostel deleted successfully");
        fetchStats();
      } catch (err) {
        const msg = err?.response?.data?.message || "Cannot delete hostel. It may have active bookings.";
        openNotification("error", msg);
      }
    }
  };

  const cardsData = [
    {
      title: "Total Hostels",
      value: stats?.totalRooms,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: `${stats?.growth?.isPositive ? "+" : "-"}${stats?.growth?.percentage ?? 0}%`,
      trendText: "vs last week",
      showTrend: true,
    },
    { title: "Available", value: stats?.availableRooms, bg: "#EFF9FF", iconBg: "#C7DAE7", image: home2 },
    { title: "Occupied", value: stats?.occupiedRooms, bg: "#F7EFFF", iconBg: "#DED0EC", image: home3 },
    { title: "Maintenance", value: stats?.maintenanceRooms, bg: "#F3F4FB", iconBg: "#CBCEE7", image: home4 },
  ];

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  const activeFilterCount = [sort, status].filter(Boolean).length;

  return (
    <>
      <MatrixCard showshadow="true" data={cardsData} icon={home} loading={!stats} />

      <div className="p-1 ml-0 mt-5 sm:ml-3 gap-[2px] flex flex-wrap items-center rounded-lg overflow-x-auto">
        {hostelTypes.map((type) => (
          <button
            key={type.label}
            onClick={() => setActiveType(type)}
            className={`px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 rounded-0 m-0 ${
              activeType.typeId === type.typeId
                ? "bg-blue text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="p-3 sm:p-4 md:p-6 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-[#000000] text-lg">
                {activeType.label} ({hostelsData?.meta?.totalItems ?? hostelsData?.data?.length ?? 0})
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white">
              <div className="w-full sm:max-w-96">
                <Input
                  placeholder="Search by hostel, hotel, or city"
                  allowClear
                  onChange={(e) => setSearch(e.target.value)}
                  prefix={<img src={searchImg} className="w-4 h-4" alt="" />}
                  className="w-full p-2 border border-lightSeconday rounded-xl font-medium"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportAll}
                  disabled={exporting}
                  className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 ${exporting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Upload size={16} /> {exporting ? "Exporting..." : "Export CSV"}
                </button>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="relative border px-2 py-2 text-sm transition-all flex items-center gap-2 rounded-lg"
                >
                  <img src={filter} alt="filter" className="w-4 h-4" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {showFilter && (
              <div className="bg-white p-3 rounded-xlg shadow-md border border-lightSeconday animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[18px] font-medium">Apply Filter</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">
                  <Select
                    className="w-full sm:w-72 h-12 border border-lightSeconday rounded-lg font-medium"
                    placeholder="Sort by name"
                    allowClear
                    value={sort || undefined}
                    onChange={(value) => setSort(value ?? null)}
                    options={SORT_OPTIONS}
                  />
                  <Select
                    className="w-full sm:w-72 h-12 border border-lightSeconday rounded-lg font-medium"
                    placeholder="Filter by status"
                    allowClear
                    value={status || undefined}
                    onChange={(value) => setStatus(value ?? null)}
                    options={STATUS_OPTIONS}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3">Filters apply automatically</p>
              </div>
            )}

            <div>
              {loading ? (
                <RoomCardSkeleton count={3} />
              ) : hostelsData?.data?.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {hostelsData.data.map((hostel) => (
                      <RoomCard
                        key={hostel.id}
                        room={hostel}
                        active={selectedHostel?.id === hostel.id}
                        onClick={() => setSelectedHostel(hostel)}
                        onStatusChange={handleStatusChange}
                        editPath="/admin/hostels/edit"
                        onDelete={() => { fetchData(); fetchStats(); }}
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                      <Select
                        defaultValue={10}
                        className="text-black"
                        onChange={(value) => setItemsPerPage(value)}
                        options={ENTIRES_PER_PAGE_OPTION.map((o) => ({ label: o, value: o }))}
                      />
                      <span className="text-lightSeconday ml-4">Entries per page</span>
                    </div>
                    <Pagination
                      current={currentPage}
                      total={hostelsData?.meta?.totalItems || 0}
                      pageSize={itemsPerPage}
                      onChange={onPageChange}
                      className="admin-pagination flex justify-end flex-wrap"
                    />
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-gray-400 font-medium">
                  No hostels found
                  {(search || status || sort) && (
                    <p className="text-sm mt-1">Try clearing the search or filters</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
              {!selectedHostel ? (
                <div className="flex flex-col items-center justify-center h-[500px] p-6 text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">Select a hostel to see details</p>
                  <p className="text-gray-400 text-sm mt-1">Click on any card from the list</p>
                </div>
              ) : (
                <RoomDetail room={selectedHostel} editPath="/admin/hostels/edit" />
              )}
            </div>
          </div>
        </div>
      </div>

      <StatusReasonModal
        open={reasonModal.open}
        status={reasonModal.status}
        reason={reason}
        onChange={setReason}
        onConfirm={() => applyStatus(reasonModal.id, reasonModal.status, reason)}
        onCancel={() => { setReasonModal({ open: false, id: null, status: "" }); setReason(""); }}
        loading={statusUpdating}
      />
    </>
  );
}