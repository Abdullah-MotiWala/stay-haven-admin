import { useState, useEffect } from "react";
import RoomCard from "../../components/RoomCard";
import RoomDetail from "../../components/roomDetail";
import filter from "../../assets/icons/filter.png";
import MatrixCard from "../../components/MatrixCard";
import home from "../../assets/icons/home.png";
import searchImg from "../../assets/icons/search.svg";
import right_arrow from "../../assets/icons/rightArrow.svg";
import { Pagination, Input, Select } from "antd";
import { getAllHostels, getStats, deleteRoom, updateRoomStatus, getBedtypeId } from "../../services/rooms";
import home1 from "../../assets/icons/home-1.png";
import home2 from "../../assets//icons/home-2.png";
import home3 from "../../assets/icons/home-3.png";
import home4 from "../../assets/icons/home-4.png";
import { openNotification } from "../../network/notification";
import { ENTIRES_PER_PAGE_OPTION } from "../../shared/constant";
import StatusReasonModal, { needsReason } from "../../components/shared/statusReasonModal";
import { RoomCardSkeleton } from "../../components/shared/skeletons";
import ExportCsvButton from "../../components/shared/ExportCsvButton";
import { getAllFeature } from "../../services/features";

const HOSTEL_EXPORT_COLUMNS = [
  { key: "roomNumber", label: "Bed/Room Number" },
  { key: "roomName", label: "Hostel Name", getValue: (r) => r.roomName || r.roomType?.title || r.type || "" },
  { key: "hotel", label: "Hotel", getValue: (r) => r.hotel?.name || "" },
  { key: "status", label: "Status" },
  { key: "pricePerNight", label: "Price/Night" },
  { key: "bedType", label: "Bed Type" },
];

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

  const { Option } = Select;

  // Fetch hostel types (same ROOM_TYPE features, deduped)
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
        // "All Hostels" tab — normal API, isHostel filter server side handle karega
        res = await getAllHostels(currentPage, itemsPerPage, status, search, sort);
        setHostelsData(res?.data);
      } else {
        // Specific type selected — pehle saare hostels lo, phir client side type match karo
        const allRes = await getAllHostels(1, 9999, status, search, sort);
        const allHostels = allRes?.data?.data || [];

        // isHostel true AND roomType/bedType ID match karo
        const filtered = allHostels.filter((r) => {
          if (!r.isHostel) return false;
          // roomType feature ID match
          const roomTypeId = r.roomType?.id || r.roomTypeId || r.bedTypeId;
          return String(roomTypeId) === String(activeType.typeId);
        });

        // Fake response structure bana do pagination ke liye
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


  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, search, activeType]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchStats();
  }, []);

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
      // Refresh stats after status change
      const res = await getStats();
      setStats(res.data.data);
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

  return (
    <>
      <MatrixCard showshadow="true" data={cardsData} icon={home} loading={!stats} />

      {/* Hostel Type Filter Tabs */}
      <div className="p-1 ml-0 sm:ml-3 gap-[2px] flex flex-wrap items-center rounded-lg overflow-x-auto">
        {hostelTypes.map((type, index) => (
          <button
            key={type.label}
            onClick={() => setActiveType(type)}
            className={`px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 rounded-0 m-0 ${
              activeType === type
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
                  placeholder="Search"
                  onChange={(e) => setSearch(e.target.value)}
                  prefix={<img src={searchImg} className="w-4 h-4" />}
                  className="w-full p-2 border border-lightSeconday rounded-xl font-medium"
                />
              </div>
              <div className="flex items-center gap-2">
                <ExportCsvButton
                  data={hostelsData?.data || []}
                  columns={HOSTEL_EXPORT_COLUMNS}
                  fileName="hostels.csv"
                />
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="border px-2 py-2 text-sm transition-all flex items-center gap-2 rounded-lg"
                >
                  <img src={filter} alt="filter" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showFilter && (
              <div className="bg-white p-3 rounded-xlg shadow-md border border-lightSeconday animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-[18px] font-medium">Apply Filter</h3>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">
                    <Select
                      className="w-full sm:w-72 h-12 border border-lightSeconday rounded-lg font-medium"
                      defaultValue="sort"
                      onChange={(value) => setSort(value)}
                      suffixIcon={<img src={right_arrow} alt="" />}
                    >
                      <Option value="sort" disabled>Sort by name</Option>
                      <Option value="ASC">A → Z</Option>
                      <Option value="DESC">Z → A</Option>
                    </Select>
                    <Select
                      className="w-full sm:w-72 h-12 border border-lightSeconday rounded-lg font-medium"
                      defaultValue="sort"
                      onChange={(value) => setStatus(value)}
                      suffixIcon={<img src={right_arrow} alt="" />}
                    >
                      <Option value="sort" disabled>Sort by Status</Option>
                      <Option value="available">Available</Option>
                      <Option value="active">Active</Option>
                      <Option value="occupied">Occupied</Option>
                      <Option value="maintenance">Maintenance</Option>
                      <Option value="inactive">Inactive</Option>
                      <Option value="booked">Booked</Option>

                    </Select>
                  </div>
                  <button
                    onClick={() => fetchData()}
                    className="bg-blue text-white px-2 py-2.5 w-36 rounded-md font-semibold text-sm h-11"
                  >
                    Apply
                  </button>
                </div>
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
                        onDelete={() => fetchData()}
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
                <div className="py-16 text-center text-gray-400 font-medium">No data found</div>
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
