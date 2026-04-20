import React, { useState, useMemo, useRef } from "react";
import { MoreVertical, Filter, ChevronDown, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_HOTEL_CODE, DEFAULT_IMAGE } from "../../shared/constant";
import { bulkActionApi } from "../../services/hotel";
import { openNotification } from "../../network/notification";
import { exportToExcel } from "../../utils/exportExcel";
import { deriveBookingStatus } from "../../helper";
import search from "../../assets/icons/search.png";
import { RotateCcw } from "lucide-react";
import tablecalender from "../../assets/icons/tablecalender.png";
import { Select } from "antd";

const HotelDirectory = ({
  data = [],
  columns = [],
  onDelete,
  onImportCSV,
  filter = true,
  title = "Directory",
  view = false,
  setRefresh,
  lastId = null,
  inp,
  onlyFilter,
  path,
  checkbox = true,
  activeType,
  roomTypes = [],
  onStatusToggle,
  hoteloptions = false,
  editpath,
  viewpath,
  onRowClick,
  extraActions = []
}) => {
  const navigate = useNavigate();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [rowActionOpen, setRowActionOpen] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { Option } = Select;
  const targetPath = editpath ? editpath : path;

  const [filters, setFilters] = useState({
    roomType: "",
    hotelName: "",
    duration: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRoom = !filters.roomType || item.roomType === filters.roomType;

      const matchesHotel =
        !filters.hotelName ||
        item.hotelName === filters.hotelName ||
        item.hotel?.name === filters.hotelName ||
        item.name === filters.hotelName;

      // ── Status filter: use actual row.status, not derived ──
      const actualStatus = item.status?.toLowerCase() || "";
      const matchesStatus =
        !filters.status ||
        actualStatus === filters.status.toLowerCase();

      let matchesDate = true;
      if (item.checkInOut && (filters.dateFrom || filters.dateTo)) {
        const startDateStr = item.checkInOut.split(" - ")[0];
        const bookingStartDate = new Date(startDateStr);
        bookingStartDate.setHours(0, 0, 0, 0);
        if (filters.dateFrom) {
          const dFrom = new Date(filters.dateFrom);
          dFrom.setHours(0, 0, 0, 0);
          if (bookingStartDate < dFrom) matchesDate = false;
        }
        if (filters.dateTo) {
          const dTo = new Date(filters.dateTo);
          dTo.setHours(0, 0, 0, 0);
          if (bookingStartDate > dTo) matchesDate = false;
        }
      }

      let matchesDuration = true;
      if (filters.duration && (item.duration || item.updatedAt)) {
        const stayNights = parseInt(item.duration || item.updatedAt) || 0;
        if (filters.duration === "24h" && stayNights !== 1) matchesDuration = false;
        else if (filters.duration === "1w" && stayNights > 7) matchesDuration = false;
        else if (filters.duration === "3w" && stayNights > 21) matchesDuration = false;
      }

      return matchesSearch && matchesRoom && matchesHotel && matchesStatus && matchesDate && matchesDuration;
    });
  }, [searchTerm, data, filters]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => {
    setFilters({ roomType: "", hotelName: "", duration: "", status: "", dateFrom: "", dateTo: "" });
    setSearchTerm("");
  };

  const bookings = Array.isArray(data) ? data : [data];
  const safeBookings = bookings.filter((item) => item && (item.hotelName || item.name));
  const uniqueHotels = [...new Set(safeBookings.map((item) => item.hotelName || item.hotel?.name || item.name))];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
      case "reserved":    return "bg-lightYellow text-black";
      case "checked-in":
      case "checkin":     return "bg-lightGreenOne text-darkGreen";
      case "checked-out":
      case "checkout":
      case "completed":   return "bg-shadeGreen text-black";
      case "maintenance": return "bg-lightYellow text-lightSeconday";
      case "draft":       return "bg-lightBrown text-lightSeconday";
      case "inactive":
      case "deactivate":  return "bg-lightBlue text-blue";
      case "active":
      case "available":   return "bg-lightGreenOne text-darkGreen";
      case "occupied":    return "bg-lightYellow text-black";
      case "cancelled":
      case "canceled":    return "bg-lightRed text-red";
      case "delete":      return "bg-red-100 text-red-600";
      default:            return "bg-gray-100 text-gray-600";
    }
  };

  const getRoomTypeStyle = (type) => {
    switch (type) {
      case "Deluxe":   return "bg-lightYellow text-black";
      case "Standard": return "bg-shadeGreen text-black";
      default:         return "bg-gray-100 text-gray-600";
    }
  };

  // ── FIXED: actual status pehle, dates se derive sirf fallback ──────────
  const getRowStatus = (row) => {
    const s = row.status?.toLowerCase();

    // Pehle actual API status check karo
    if (s === "cancelled" || s === "canceled")  return "Cancelled";
    if (s === "checked-in" || s === "checkin")  return "Checked-In";
    if (s === "checked-out" || s === "checkout") return "Checked-Out";
    if (s === "completed")  return "Completed";
    if (s === "booked")     return "Booked";
    if (s === "reserved")   return "Reserved";

    // Hotel/room statuses
    if (row.isDeleted)      return "Deleted";
    if (s === "active")     return "Active";
    if (s === "available")  return "Available";
    if (s === "occupied")   return "Occupied";
    if (s === "maintenance") return "Maintenance";
    if (s === "deactivate" || s === "inactive") return "Inactive";
    if (s === "draft")      return "Draft";

    // Sirf agar status bilkul nahi hai toh dates se derive karo
    if (!s && row.checkInOut) return deriveBookingStatus(row.checkInOut);

    return row.status || "—";
  };

  const toggleRow = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () => setSelectedIds(selectedIds.length === data.length ? [] : data.map((row) => row.id));

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) { openNotification("info", "Please select at least one row"); return; }
    try {
      await bulkActionApi({ ids: selectedIds, action });
      setSelectedIds([]);
      setBulkOpen(false);
      setRefresh(true);
    } catch (err) { console.error("Bulk action failed", err); }
  };

  const handleExportExcel = () => {
    const rowsToExport = selectedIds.length > 0 ? data.filter((row) => selectedIds.includes(row.id)) : data;
    if (rowsToExport.length === 0) { openNotification("info", "No data to export"); return; }
    exportToExcel({ data: rowsToExport, columns, fileName: "hotels.xlsx" });
  };

  const renderCell = (row, col, index) => {
    switch (col.type) {
      case "hotelCell":
        return (
          <div className="flex items-center gap-2">
            <img
              src={row.hotel?.imageUrl || DEFAULT_IMAGE}
              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
              alt=""
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 m-0 truncate">
                {row.hotelName || row.hotel?.name || "—"}
              </p>
              {row.hotel?.city && (
                <p className="text-xs text-gray-400 m-0">{row.hotel.city}</p>
              )}
            </div>
          </div>
        );

      case "text":   return row[col.key] ?? "—";
      case "number": return row[col.key] ?? 0;

      case "hotel":
        return (
          <div className="flex items-center gap-3">
            <img src={row.imageUrl ?? DEFAULT_IMAGE} className="w-10 h-10 rounded-lg object-cover" alt={row.name} />
            <div>
              <div className="text-sm font-semibold text-gray-900">{row.name ?? "N/A"}</div>
              <div className="text-xs text-gray-400">{row.city ?? "N/A"}</div>
            </div>
          </div>
        );

      case "roomType": {
        const typeLabel = typeof row.roomType === "object" ? row.roomType?.title : row.roomType;
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center whitespace-nowrap ${getRoomTypeStyle(typeLabel)}`}>
            {typeLabel ?? "N/A"}
          </span>
        );
      }

      case "fallback": return "-";

      case "dateRange":
        return <span className="text-sm text-gray-900 text-center">{row.checkInOut ?? "-"}</span>;

      case "status": {
        const status = getRowStatus(row);
        if (onStatusToggle) {
          const STATUS_OPTIONS = hoteloptions
            ? ["active", "inactive", "maintenance", "draft"]
            : ["available", "active", "occupied", "maintenance", "inactive"];
          return (
            <div className="relative inline-block">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRowActionOpen(rowActionOpen === `status-${index}` ? null : `status-${index}`);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer whitespace-nowrap flex items-center gap-1 ${getStatusStyle(status)}`}
              >
                {status}
                <span className="text-[10px]">▾</span>
              </button>
              {rowActionOpen === `status-${index}` && (
                <div className="absolute top-full mt-1 left-0 bg-white border rounded-lg shadow-lg z-50 w-32">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRowActionOpen(null);
                        onStatusToggle(row.id, opt);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs capitalize hover:bg-gray-50 ${row.status?.toLowerCase() === opt ? "font-bold text-blue" : "text-gray-700"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(status)}`}>
            {status}
          </span>
        );
      }

      case "actions":
        return (
          <button onClick={() => setRowActionOpen(rowActionOpen === index ? null : index)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">
            <MoreVertical size={16} />
          </button>
        );

      default: return "-";
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {inp && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <img src={search} className="w-4 h-4" alt="search" />
              </span>
              <input
                type="text"
                className="border border-2 rounded-md bg-inpgraysecondary font-medium pl-10 pr-5 py-2"
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {filter && (
            <div className="flex items-center gap-2">
              <button className="p-2 border rounded-lg hover:bg-gray-50" onClick={() => setShowFilter(!showFilter)}>
                <Filter size={16} />
              </button>
              {!onlyFilter && (
                <>
                  <div className="relative">
                    <button onClick={() => setBulkOpen(!bulkOpen)} className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1">
                      Bulk Actions <ChevronDown size={14} />
                    </button>
                    {bulkOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md z-50">
                        {["Active", "InActive", "Delete", "Draft", "Maintenance"].map((item) => (
                          <button key={item} onClick={() => { handleBulkAction(item.split(" ")[0].toLowerCase()); setBulkOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={handleExportExcel} className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2">
                    <Upload size={16} /> Import / Export CSV
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FILTER PANEL */}
      {showFilter && (
        <div className="flex justify-end w-full">
          <div className="bg-white border rounded-2xl p-6 shadow-sm w-full mb-6">
            <h3 className="text-gray-900 font-bold text-lg mb-5">Apply Filters</h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${hoteloptions ? "lg:grid-cols-2" : "lg:grid-cols-4"} gap-4`}>
              {!hoteloptions && (
                <div className="relative ant-select-custom">
                  <Select placeholder={activeType === "Apartment Bookings" ? "Select Apartment" : "Select Room"} value={filters.roomType || undefined} onChange={(val) => handleFilterChange("roomType", val)} className="w-full h-[50px] custom-antd-select" suffixIcon={<ChevronDown size={18} className="text-gray-900" />} showSearch>
                    <Option value="">Select Room</Option>
                    {roomTypes.length > 0 ? roomTypes.map((type) => (<Option key={type.id} value={type.id}>{type.title}</Option>)) : (<><Option value="One Bed Room">One Bed Room</Option><Option value="Two Bed Room">Two Bed Room</Option></>)}
                  </Select>
                </div>
              )}

              <div className="relative ant-select-custom">
                <Select placeholder="Select Hotel" value={filters.hotelName || undefined} onChange={(val) => handleFilterChange("hotelName", val)} className="w-full h-[50px] custom-antd-select" suffixIcon={<ChevronDown size={18} className="text-gray-900" />} showSearch>
                  <Option value="">Select Hotel</Option>
                  {uniqueHotels.map((hotel) => (<Option key={hotel} value={hotel}>{hotel}</Option>))}
                </Select>
              </div>

              {!hoteloptions && (
                <div className="relative ant-select-custom">
                  <Select placeholder="Sort by Duration" value={filters.duration || undefined} onChange={(val) => handleFilterChange("duration", val)} className="w-full h-[50px] custom-antd-select" suffixIcon={<ChevronDown size={18} className="text-gray-900" />} showSearch>
                    <Option value="">Sort by Duration</Option>
                    <Option value="24h">24 Hours</Option>
                    <Option value="1w">1 Week</Option>
                    <Option value="3w">3 Weeks</Option>
                  </Select>
                </div>
              )}

              <div className="relative ant-select-custom">
                <Select placeholder="Sort by Status" value={filters.status || undefined} onChange={(val) => handleFilterChange("status", val)} className="w-full h-[50px] custom-antd-select" suffixIcon={<ChevronDown size={18} className="text-gray-900" />} showSearch>
                  <Option value="">Sort by Status</Option>
                  {hoteloptions ? (
                    <><Option value="active">Active</Option><Option value="inactive">InActive</Option><Option value="maintenance">Maintenance</Option><Option value="draft">Draft</Option></>
                  ) : (
                    <><Option value="Booked">Booked</Option><Option value="Completed">Completed</Option><Option value="Cancelled">Cancelled</Option><Option value="Checked-In">Checked In</Option><Option value="Checked-Out">Checked Out</Option></>
                  )}
                </Select>
              </div>

              {!hoteloptions && (
                <>
                  <div className="relative w-full">
                    <img src={tablecalender} alt="calendar" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-20" />
                    <input type="date" value={filters.dateFrom} onChange={(e) => handleFilterChange("dateFrom", e.target.value)} className="w-full bg-inpgraysecondary border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-700 font-medium focus:outline-none appearance-none custom-date-input" />
                  </div>
                  <div className="relative w-full">
                    <img src={tablecalender} alt="calendar" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-20" />
                    <input type="date" value={filters.dateTo} onChange={(e) => handleFilterChange("dateTo", e.target.value)} className="w-full bg-inpgraysecondary border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-700 font-medium focus:outline-none appearance-none custom-date-input" />
                  </div>
                </>
              )}

              <div className="lg:col-span-2 flex items-center justify-end gap-3">
                <button onClick={resetFilters} className="flex items-center gap-2 px-6 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all border border-gray-100">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
                <button onClick={() => setShowFilter(false)} className="px-10 py-3 bg-blue text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {checkbox && (
                <th className="w-10 border-b border-t border-r border-dashed">
                  <input type="checkbox" checked={selectedIds.length === data.length && data.length > 0} onChange={toggleAll} className="checked:accent-blue" />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-4 text-xs font-semibold uppercase tracking-wide text-blue border-b border-t border-l border-dashed border-gray-200 ${col.type === "status" || col.type === "actions" ? "text-center" : "text-left"}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!Array.isArray(filteredData) || filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-sm text-gray-500">No data found</td>
              </tr>
            ) : (
              filteredData.map((row, index) => {
                const uiHotelId = `#${BASE_HOTEL_CODE}-${String(index + 1).padStart(2, "0")}`;
                const enrichedRow = { ...row, uiHotelId };
                return (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-lightWhite"} hover:bg-blue-50 transition-colors`}>
                    {checkbox && (
                      <td className="border-b border-t border-r border-dashed">
                        <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleRow(row.id)} className="checked:accent-blue" />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-4 text-sm border-b border-t border-l border-dashed relative ${col.type === "status" || col.type === "actions" ? "text-center" : "text-left"}`}>
                        <div className={`flex items-center ${col.type === "status" || col.type === "actions" ? "justify-center" : "justify-start"}`}>
                          {renderCell(enrichedRow, col, index)}
                        </div>

                        {/* ACTION DROPDOWN */}
                        {col.type === "actions" && rowActionOpen === index && (
                          <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-50">
                            {extraActions.map((action) => (
                              <button
                                key={action.label}
                                onClick={() => { setRowActionOpen(null); action.onClick(row); }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-blue font-medium"
                              >
                                {action.label}
                              </button>
                            ))}
                            {view && (
                              <button
                                onClick={() => {
                                  setRowActionOpen(null);
                                  navigate(`${viewpath || path}/${row.id}`, { state: { lastId, fromTab: activeType } });
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              >
                                View
                              </button>
                            )}
                            <button
                              onClick={() => { setRowActionOpen(null); navigate(`${targetPath}/${row.id}`, { state: { lastId, fromTab: activeType } }); }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => { setRowActionOpen(null); onDelete(row.id); }}
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelDirectory;