import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, toggleUserStatus } from "../../../services/user";
import { getAllHotels, hotelStatusUpdate } from "../../../services/hotel";
import { getAllRooms, getAllHostels, updateRoomStatus } from "../../../services/rooms";
import { getAllApartments, updateApartmentStatus } from "../../../services/appartments";
import { openNotification } from "../../../network/notification";
import Breadcrumb from "../../../components/Breadcrumb";
import editIcon from "../../../assets/icons/editIcon.png";
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

const HostView = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [host, setHost]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);

  const [activeTab, setActiveTab]   = useState("Hotels");
  const [tabData, setTabData]       = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal]           = useState(0);
  const itemsPerPage = 10;
  // per-row status dropdown
  const [openStatusRow, setOpenStatusRow] = useState(null);

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
          // isHostel: true wale exclude karo
          data = (res.data?.data || []).filter(r => !r.isHostel);
        } else if (activeTab === "Apartments") {
          res  = await getAllApartments(currentPage, itemsPerPage, "", "", "asc", "All", id);
          data = res.data?.data || [];
        } else {
          res  = await getAllHostels(currentPage, itemsPerPage, "", "", "asc", id);
          // sirf isHostel: true wale
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

  /* ── status change ────────────────────────────────────────────── */
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
      // update local state
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

      {/* ── Profile Card — matches HotelProfile layout exactly ───── */}
      <div className="w-full overflow-x-hidden bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mt-4">

        {/* header row */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-bold text-[#1B2559]">Host Profile</h3>
          {/* <button
            onClick={() => navigate(`/admin/hosts/edit/${id}`)}
            className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-sm font-semibold text-extradark hover:bg-gray-50 transition-all duration-300"
          >
            <img src={editIcon} alt="Edit" />
            Edit
          </button> */}
        </div>

        {/* body row */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-4">

          {/* Avatar circle — dark red like screenshot */}
          <div
            className="w-[120px] h-[120px] rounded-full flex-shrink-0 flex items-center justify-center text-white text-4xl font-bold shadow"
            style={{ background: "#8B1A1A" }}
          >
            {initial}
          </div>

          {/* Name + role + status  |  email + phone */}
          <div className="flex-1 flex flex-col lg:flex-row items-start gap-8">

            {/* left: name / role / status */}
            <div className="w-full max-w-[260px] shrink-0">
              <p className="text-sm text-[#8B95B7]">Host</p>
              <h1 className="text-[26px] font-semibold text-[#1B2559] leading-tight">
                {host.name}
              </h1>

              {/* status dropdown */}
              <div className="mt-4 relative inline-block">
                <div
                  onClick={() => setStatusOpen(p => !p)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${getStatusStyle(host.status)}`}
                >
                  {host.status || "active"}
                  <img src={downArrowIcon} alt="arrow" className="w-2 h-1.5" />
                </div>
                {statusOpen && (
                  <div className="absolute top-full left-0 mt-1 w-28 bg-white border rounded-lg shadow-md z-50">
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
              </div>
            </div>

            {/* divider */}
            <span className="hidden lg:block self-stretch w-px bg-lightSeconday" />

            {/* right: email + phone — same label style as HotelProfile */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-1">
                  Email
                </p>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#1B2559]">
                  <Mail size={14} className="text-red flex-shrink-0" />
                  {host.email || "—"}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-1">
                  Phone
                </p>
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

        {/* tab buttons */}
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

        {/* content */}
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
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenStatusRow(openStatusRow === row.id ? null : row.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(row.status)}`}
                          >
                            {row.status || "—"}
                            <img src={downArrowIcon} alt="" className="w-2 h-1.5" />
                          </button>

                          {openStatusRow === row.id && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-50">
                              {getStatusOptions(activeTab).map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => handleListingStatusChange(row.id, opt)}
                                  className="w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-50"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
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
    </div>
  );
};

/* ── column definitions ─────────────────────────────────────────── */
const getColumns = (tab) => {
  switch (tab) {
    case "Hotels":
      return [
        {
          key: "name", label: "Hotel Name",
          render: r => (
            <div className="flex items-center gap-3">
              <img
                src={r.imageUrl || DEFAULT_IMAGE}
                className="w-9 h-9 rounded-lg object-cover"
                alt=""
              />
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
        { key: "roomName",      label: "Room Name" },
        { key: "roomNumber",    label: "Room No." },
        { key: "pricePerNight", label: "Price/Night", render: r => r.pricePerNight ? `PKR ${r.pricePerNight}` : "—" },
        { key: "maxAdults",     label: "Max Guests" },
      ];
    case "Apartments":
      return [
        { key: "apartmentName",   label: "Apartment" },
        { key: "apartmentNumber", label: "Apt No." },
        { key: "pricePerNight",   label: "Price/Night", render: r => r.pricePerNight ? `PKR ${r.pricePerNight}` : "—" },
        { key: "maxAdults",       label: "Max Guests" },
      ];
    case "Hostels":
      return [
        { key: "roomName",      label: "Hostel Name" },
        { key: "roomNumber",    label: "Bed/Room No." },
        { key: "pricePerNight", label: "Price/Night", render: r => r.pricePerNight ? `PKR ${r.pricePerNight}` : "—" },
        { key: "maxAdults",     label: "Capacity" },
      ];
    default:
      return [];
  }
};

/* ── status options per tab ─────────────────────────────────────── */
const getStatusOptions = (tab) => {
  if (tab === "Hotels") return ["active", "inactive", "maintenance", "draft"];
  if (tab === "Apartments") return ["available", "occupied", "maintenance", "inactive"];
  return ["available", "occupied", "maintenance", "inactive"]; // Rooms & Hostels
};

export default HostView;
