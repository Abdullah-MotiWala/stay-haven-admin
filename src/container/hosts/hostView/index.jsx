import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, toggleUserStatus } from "../../../services/user";
import { getAllHotels, hotelStatusUpdate } from "../../../services/hotel";
import { getAllRooms, getAllHostels, updateRoomStatus } from "../../../services/rooms";
import { getAllApartments, updateApartmentStatus } from "../../../services/appartments";
import { openNotification } from "../../../network/notification";
import Breadcrumb from "../../../components/Breadcrumb";
import downArrowIcon from "../../../assets/icons/downArrowIcon.png";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import { Mail, Phone } from "lucide-react";
import { Pagination } from "antd";

const TABS = ["Hotels", "Rooms", "Apartments", "Hostels"];

const getStatusStyle = (s) => {
  switch (s?.toLowerCase()) {
    case "active":
    case "available":   return "bg-lightGreenOne text-darkGreen";
    case "inactive":    return "bg-lightBlue text-blue";
    case "occupied":    return "bg-lightYellow text-black";
    case "maintenance": return "bg-lightYellow text-lightSeconday";
    case "cancelled":
    case "canceled":    return "bg-lightRed text-red";
    default:            return "bg-gray-100 text-gray-600";
  }
};

const getColumns = (tab) => {
  switch (tab) {
    case "Hotels":
      return [
        {
          key: "name", label: "Hotel Name",
          render: r => (
            <div className="flex items-center gap-3">
              <img src={r.imageUrl || DEFAULT_IMAGE} className="w-9 h-9 rounded-lg object-cover" alt="" />
              <div>
                <p className="font-semibold text-gray-900 m-0">{r.name ?? "—"}</p>
                <p className="text-xs text-gray-400 m-0">{r.city ?? ""}</p>
              </div>
            </div>
          ),
        },
        { key: "totalRooms",     label: "Total Rooms" },
        { key: "roomsAvailable", label: "Available" },
        { key: "roomsOccupied",  label: "Occupied" },
      ];
    case "Rooms":
      return [
        {
          key: "roomName", label: "Room Name",
          render: r => (
            <div className="flex items-center gap-3">
              <img src={r.mainImage || DEFAULT_IMAGE} className="w-9 h-9 rounded-lg object-cover" alt="" />
              <span className="font-semibold text-gray-900">{r.roomName ?? "—"}</span>
            </div>
          ),
        },
        { key: "roomNumber",    label: "Room No." },
        { key: "pricePerNight", label: "Price/Night", render: r => r.pricePerNight ? `PKR ${r.pricePerNight}` : "—" },
        { key: "maxAdults",     label: "Max Guests" },
      ];
    case "Apartments":
      return [
        {
          key: "apartmentName", label: "Apartment",
          render: r => (
            <div className="flex items-center gap-3">
              <img src={r.mainImage || DEFAULT_IMAGE} className="w-9 h-9 rounded-lg object-cover" alt="" />
              <span className="font-semibold text-gray-900">{r.apartmentName ?? "—"}</span>
            </div>
          ),
        },
        { key: "apartmentNumber", label: "Apt No." },
        { key: "pricePerNight",   label: "Price/Night", render: r => r.pricePerNight ? `PKR ${r.pricePerNight}` : "—" },
        { key: "maxAdults",       label: "Max Guests" },
      ];
    case "Hostels":
      return [
        {
          key: "roomName", label: "Hostel Name",
          render: r => (
            <div className="flex items-center gap-3">
              <img src={r.mainImage || DEFAULT_IMAGE} className="w-9 h-9 rounded-lg object-cover" alt="" />
              <span className="font-semibold text-gray-900">{r.roomName ?? "—"}</span>
            </div>
          ),
        },
        { key: "roomNumber",    label: "Bed/Room No." },
        { key: "pricePerNight", label: "Price/Night", render: r => r.pricePerNight ? `PKR ${r.pricePerNight}` : "—" },
        { key: "maxAdults",     label: "Capacity" },
      ];
    default:
      return [];
  }
};

const getStatusOptions = (tab) => {
  if (tab === "Hotels")     return ["active", "inactive", "maintenance", "draft"];
  if (tab === "Apartments") return ["available", "occupied", "maintenance", "inactive"];
  return ["available", "occupied", "maintenance", "inactive"];
};

const HostView = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [host, setHost]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [profileDropdownPos, setProfileDropdownPos] = useState({ top: 0, left: 0 });

  const [activeTab, setActiveTab]     = useState("Hotels");
  const [tabData, setTabData]         = useState([]);
  const [tabLoading, setTabLoading]   = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal]             = useState(0);
  const itemsPerPage = 10;

  const [openStatusRow, setOpenStatusRow] = useState(null);
  const [dropdownPos, setDropdownPos]     = useState({ top: 0, left: 0 });

  /* ── host profile ─────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getUserById(id);
        setHost(res.data?.data || res.data);
      } catch {
        openNotification("error", "Failed to load host");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── tab data ─────────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      setTabLoading(true);
      try {
        let res, data;
        if (activeTab === "Hotels") {
          res  = await getAllHotels(currentPage, itemsPerPage, id);
          data = res.data?.data || [];
        } else if (activeTab === "Rooms") {
          res  = await getAllRooms(currentPage, itemsPerPage, "", "", "asc", "All Rooms", id);
          data = (res.data?.data || []).filter(r => !r.isHostel);
        } else if (activeTab === "Apartments") {
          res  = await getAllApartments(currentPage, itemsPerPage, "", "", "asc", "All", id);
          data = res.data?.data || [];
        } else {
          res  = await getAllHostels(currentPage, itemsPerPage, "", "", "asc", id);
          data = (res.data?.data || []).filter(r => r.isHostel);
        }
        setTabData(data);
        setTotal(res.data?.meta?.totalItems || data.length);
      } catch {
        openNotification("error", `Failed to load ${activeTab}`);
      } finally {
        setTabLoading(false);
      }
    })();
  }, [activeTab, currentPage, id]);

  /* ── close dropdowns on outside click ───────────────────────── */
  useEffect(() => {
    const handler = () => {
      setStatusOpen(false);
      setOpenStatusRow(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* ── host profile status click ───────────────────────────────── */
  const handleProfileStatusClick = (e) => {
    e.stopPropagation();
    if (statusOpen) { setStatusOpen(false); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setProfileDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setStatusOpen(true);
  };

  /* ── host status change ───────────────────────────────────────── */
  const handleStatusChange = async (newStatus) => {
    try {
      await toggleUserStatus(id);
      setHost(prev => ({ ...prev, status: newStatus }));
      openNotification("success", "Status updated");
    } catch {
      openNotification("error", "Failed to update status");
    } finally {
      setStatusOpen(false);
    }
  };

  /* ── listing status change ───────────────────────────────────── */
  const handleListingStatusChange = async (rowId, newStatus) => {
    try {
      if (activeTab === "Hotels") {
        await hotelStatusUpdate(rowId, { status: newStatus });
      } else if (activeTab === "Rooms" || activeTab === "Hostels") {
        await updateRoomStatus(rowId, newStatus);
      } else if (activeTab === "Apartments") {
        await updateApartmentStatus(rowId, newStatus);
      }
      setTabData(prev =>
        prev.map(r => r.id === rowId ? { ...r, status: newStatus } : r)
      );
      openNotification("success", "Status updated");
    } catch {
      openNotification("error", "Failed to update status");
    } finally {
      setOpenStatusRow(null);
    }
  };

  /* ── row status dropdown click ───────────────────────────────── */
  const handleRowStatusClick = (e, rowId) => {
    e.stopPropagation();
    if (openStatusRow === rowId) { setOpenStatusRow(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setOpenStatusRow(rowId);
  };

  if (loading) return (
    <div className="p-20 text-center text-blue font-semibold animate-pulse">
      Loading Host Profile...
    </div>
  );
  if (!host) return (
    <div className="p-20 text-center text-red-500 font-bold">Host Not Found</div>
  );

  const initial = (host.name || "H")[0].toUpperCase();

  return (
    <div className="!overflow-x-hidden">
      <div className="mt-4 px-3">
        <Breadcrumb title="Hosts" subtitle="View host" />
      </div>

      {/* ── Profile Card ───────────────────────────────────────────── */}
      <div className="w-full bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mt-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-bold text-[#1B2559]">Host Profile</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mb-4">
          {/* Avatar */}
          <div
            className="w-[120px] h-[120px] rounded-full flex-shrink-0 flex items-center justify-center text-white text-4xl font-bold shadow"
            style={{ background: "#8B1A1A" }}
          >
            {initial}
          </div>

          <div className="flex-1 flex flex-col lg:flex-row items-start gap-8">
            {/* Name + status */}
            <div className="w-full max-w-[260px] shrink-0">
              <p className="text-sm text-[#8B95B7]">Host</p>
              <h1 className="text-[26px] font-semibold text-[#1B2559] leading-tight">
                {host.name}
              </h1>

              {/* ✅ Profile status — fixed dropdown */}
              <div className="mt-4 inline-block">
                <div
                  onClick={handleProfileStatusClick}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer select-none ${getStatusStyle(host.status)}`}
                >
                  {host.status || "active"}
                  <img src={downArrowIcon} alt="arrow" className="w-2 h-1.5" />
                </div>
              </div>
            </div>

            {/* divider */}
            <span className="hidden lg:block self-stretch w-px bg-lightSeconday" />

            {/* Email + Phone */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-1">Email</p>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#1B2559]">
                  <Mail size={14} className="text-red flex-shrink-0" />
                  {host.email || "—"}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-1">Phone</p>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#1B2559]">
                  <Phone size={14} className="text-red flex-shrink-0" />
                  {host.phoneNumber || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Listings Tabs ─────────────────────────────────────────── */}
      <div className="mt-6 bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
        <div className="flex gap-1 mb-6 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {tabLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue" />
          </div>
        ) : tabData.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-medium">
            No {activeTab} found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {getColumns(activeTab).map(col => (
                      <th
                        key={col.key}
                        className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-blue border-b border-t border-l border-dashed border-gray-200"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-blue border-b border-t border-l border-dashed border-gray-200">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tabData.map((row, i) => (
                    <tr
                      key={row.id || i}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-lightWhite"} hover:bg-blue-50 transition-colors`}
                    >
                      {getColumns(activeTab).map(col => (
                        <td
                          key={col.key}
                          className="px-4 py-4 text-sm border-b border-t border-l border-dashed border-gray-200 text-gray-700"
                        >
                          {col.render ? col.render(row) : (row[col.key] ?? "—")}
                        </td>
                      ))}
                      <td className="px-4 py-4 text-sm border-b border-t border-l border-dashed border-gray-200 text-center">
                        <button
                          onClick={(e) => handleRowStatusClick(e, row.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap mx-auto ${getStatusStyle(row.status)}`}
                        >
                          {row.status || "—"}
                          <img src={downArrowIcon} alt="" className="w-2 h-1.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total > itemsPerPage && (
              <div className="mt-4 flex justify-end">
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={itemsPerPage}
                  onChange={p => setCurrentPage(p)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ Global fixed dropdown — Profile Status */}
      {statusOpen && (
        <div
          className="fixed bg-white border rounded-lg shadow-md z-[999] w-28"
          style={{ top: profileDropdownPos.top, left: profileDropdownPos.left }}
          onClick={e => e.stopPropagation()}
        >
          {["active", "inactive"].map(opt => (
            <button
              key={opt}
              onClick={() => handleStatusChange(opt)}
              className="w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-100"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Global fixed dropdown — Row Status */}
      {openStatusRow && (
        <div
          className="fixed bg-white border rounded-lg shadow-lg z-[999] w-32"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
          onClick={e => e.stopPropagation()}
        >
          {getStatusOptions(activeTab).map(opt => (
            <button
              key={opt}
              onClick={() => handleListingStatusChange(openStatusRow, opt)}
              className="w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostView;