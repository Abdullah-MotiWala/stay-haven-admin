import React, { useState, useMemo, useRef } from "react";
import { MoreVertical, Filter, ChevronDown, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_HOTEL_CODE, DEFAULT_IMAGE } from "../../shared/constant";
import { bulkActionApi } from "../../services/hotel";
import { openNotification } from "../../network/notification";
import { exportToExcel } from "../../utils/exportExcel";
import { deriveBookingStatus } from "../../helper";
import search from "../../assets/icons/search.png";
import { Calendar, RotateCcw } from "lucide-react";
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
  onStatusToggle
}) => {
  const navigate = useNavigate();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [rowActionOpen, setRowActionOpen] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { Option } = Select;

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
        item.guestName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRoom =
        !filters.roomType || item.roomType === filters.roomType;
      const matchesHotel =
        !filters.hotelName || item.hotelName === filters.hotelName;
      const itemStatus = item.checkInOut
        ? deriveBookingStatus(item.checkInOut)
        : item.status;
      const matchesStatus =
        !filters.status ||
        itemStatus?.toLowerCase() === filters.status.toLowerCase();

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
      if (filters.duration && item.duration) {
        const stayNights = parseInt(item.duration);

        if (filters.duration === "24h") {
          if (stayNights !== 1) matchesDuration = false;
        } else if (filters.duration === "1w") {
          if (stayNights > 7) matchesDuration = false;
        } else if (filters.duration === "3w") {
          if (stayNights > 21) matchesDuration = false;
        }
      }

      return (
        matchesSearch &&
        matchesRoom &&
        matchesHotel &&
        matchesStatus &&
        matchesDate &&
        matchesDuration
      );
    });
  }, [searchTerm, data, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      roomType: "",
      hotelName: "",
      duration: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
  };

  // const uniqueHotels = [...new Set(data?.map((item) => item.hotelName))];

  // Replace your current code with this:
  const bookings = Array.isArray(data) ? data : [data];
  const safeBookings = bookings.filter(item => item && item.hotelName); // Safe filter
  const uniqueHotels = [...new Set(safeBookings.map(item => item.hotelName))];


  // const uniqueHotels = [
  //   ...new Set(Array.isArray(data) ? data.map(item => item.hotelName) : [])
  // ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Booked":
        return "bg-lightYellow text-black";
      case "Checked-In":
        return "bg-lightGreenOne text-darkGreen";
      case "Checked-Out":
        return "bg-shadeGreen text-black";
      case "maintenance":
        return "bg-lightYellow text-lightSeconday";
      case "Draft":
        return "bg-lightBrown text-lightSeconday";
      case "Inactive":
        return "bg-lightBlue text-blue";
      case "Active":
        return "bg-lightGreenOne text-darkGreen";
      case "Inactive  || DeActive ":
        return "bg-lightRed text-red";
      case "Delete":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRoomTypeStyle = (type) => {
    switch (type) {
      case "Deluxe":
        return "bg-lightYellow text-black";
      case "Standard":
        return "bg-shadeGreen text-black";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRowStatus = (row) => {
    if (row.checkInOut) {
      return deriveBookingStatus(row.checkInOut);
    }
    if (row.isDeleted) return "Deleted";
    if (row.status === "active") return "Active";
    if (row.status === "deactivate" || row.status === "inactive")
      return "Inactive";
    if (row.status === "draft") return "Draft";
    if (row.status === "maintenance") return "Maintenance";
    return row.status;
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedIds?.length === data?.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data?.map((row) => row.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      openNotification("info", "Please select at least one row");
      return;
    }

    const payload = {
      ids: selectedIds,
      action,
    };

    try {
      await bulkActionApi(payload);
      setSelectedIds([]);
      setBulkOpen(false);
      setRefresh(true);
    } catch (err) {
      console.error("Bulk action failed", err);
    }
  };

  const handleExportExcel = () => {
    const rowsToExport =
      selectedIds.length > 0
        ? data?.filter((row) => selectedIds.includes(row.id))
        : data;

    if (rowsToExport.length === 0) {
      openNotification("info", "No data to export");
      return;
    }

    exportToExcel({
      data: rowsToExport,
      columns,
      fileName: "hotels.xlsx",
    });
  };

  const renderCell = (row, col, index) => {
    switch (col.type) {
      case "text":
        return row[col.key] ?? "-";

      case "number":
        return row[col.key] ?? 0;

      case "hotel":
        return (
          <div className="flex items-center gap-3">
            <img
              src={row.imageUrl ?? DEFAULT_IMAGE}
              className="w-10 h-10 rounded-lg object-cover"
              alt={row.name}
            />
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {row.name ?? "N/A"}
              </div>
              <div className="text-xs text-gray-400">{row.city ?? "N/A"}</div>
            </div>
          </div>
        );

      case "roomType":
        const typeLabel = typeof row.roomType === 'object' ? row.roomType.title : row.roomType;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center
      ${getRoomTypeStyle(typeLabel)}`}
          >
            {typeLabel ?? "N/A"}
          </span>
        );

      // case "computed":
      //   return row.totalRooms && row.availableRooms
      //     ? row.totalRooms - row.availableRooms
      //     : "-";

      case "fallback":
        return "-";

      case "dateRange":
        return (
          <span className="text-sm text-gray-900">{row.checkInOut ?? "-"}</span>
        );

      // case "status":
      //   const status = getRowStatus(row);
      //   console.log(status, "statusstatusstatus");
      //   return (
      //     <span
      //       className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
      //         status,
      //       )}`}
      //     >
      //       {status}
      //     </span>
      //   );
      case "status":
        const status = getRowStatus(row);

        if (onStatusToggle) {
          return (
            <button
              onClick={() => onStatusToggle(row.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusStyle(status)}`}
            >
              {status}
            </button>
          );
        }

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}
          >
            {status}
          </span>
        );

      case "actions":
        return (
          <button
            onClick={() =>
              setRowActionOpen(rowActionOpen === index ? null : index)
            }
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          >
            <MoreVertical size={16} />
          </button>
        );

      default:
        return "-";
    }
  };

  // console.log(lastId, "lastIdlastIdlastId");
  const dateInputRef = useRef(null);

  const handleIconClick = () => {
    // Yeh function input ka calendar open karega jab image par click hoga
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };
  return (
    <div className="w-full ">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        {/* Left Section: Heading aur Input ko yahan group kar diya */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {inp && (
            <div className="relative">
              {" "}
              {/* Isko relative rakhein taake icon sahi position ho */}
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <img src={search} className="w-4 h-4" alt="search" />
              </span>
              <input
                type="text"
                className="border border-2 rounded-md bg-inpgraysecondary font-medium pl-10 pr-5 py-2" // pl-10 taake text icon ke upar na aaye
                placeholder="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Right Section: Buttons aur Filters */}
        <div className="flex items-center gap-2">
          {filter && (
            <div className="flex items-center gap-2">
              {/* Ye Filter button hamesha dikhega agar 'filter' prop true hai */}
              <button
                className="p-2 border rounded-lg hover:bg-gray-50"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={16} />
              </button>

              {/* Agar 'onlyFilter' true nahi hai, sirf tabhi ye baaki buttons dikhayen */}
              {!onlyFilter && (
                <>
                  {/* Bulk Actions Button */}
                  <div className="relative">
                    <button
                      onClick={() => setBulkOpen(!bulkOpen)}
                      className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1"
                    >
                      Bulk Actions <ChevronDown size={14} />
                    </button>

                    {bulkOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md z-50">
                        {[
                          "Active Selected",
                          "InActive Selected",
                          "Delete",
                          "Draft",
                          "Maintenance",
                        ].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              handleBulkAction(
                                item.split(" ")[0].toUpperCase(),
                              );
                              setBulkOpen(!bulkOpen);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Import / Export Button */}
                  <button
                    onClick={handleExportExcel}
                    className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2"
                  >
                    <Upload size={16} />
                    Import / Export CSV
                  </button>
                </>
              )}
            </div>
          )}

          {view && (
            <button className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2">
              View
            </button>
          )}
        </div>
      </div>
      {showFilter && (
        <div className="flex justify-end w-full">
          <div className="bg-white border rounded-2xl p-6 shadow-sm w-full mb-6">
            <h3 className="text-gray-900 font-bold text-lg mb-5">
              Apply Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Select Room - Ant Design */}
              <div className="relative ant-select-custom">
                <Select
                  placeholder={
                    activeType === "Apartment Bookings"
                      ? "Select Apartment"
                      : "Select Room"
                  }
                  value={filters.roomType || undefined}
                  onChange={(val) => handleFilterChange("roomType", val)}
                  className="w-full h-[50px] custom-antd-select"
                  suffixIcon={
                    <ChevronDown size={18} className="text-gray-900" />
                  }
                >
                  <Option value="">Select Room</Option>
                  {roomTypes.length > 0 ? (
                    roomTypes.map(type => (
                      <Option key={type.id} value={type.id}>{type.title}</Option>
                    ))
                  ) : (
                    <>
                      <Option value="one-bed-id">One Bed Room</Option>
                      <Option value="two-bed-id">Two Bed Room</Option>
                    </>
                  )}
                </Select>
              </div>

              {/* Select Hotel - Ant Design */}
              <div className="relative ant-select-custom">
                <Select
                  placeholder="Select Hotel"
                  value={filters.hotelName || undefined}
                  onChange={(val) => handleFilterChange("hotelName", val)}
                  className="w-full h-[50px] custom-antd-select"
                  suffixIcon={
                    <ChevronDown size={18} className="text-gray-900" />
                  }
                >
                  <Option value="">Select Hotel</Option>
                  {uniqueHotels.map((hotel) => (
                    <Option key={hotel} value={hotel}>
                      {hotel}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Sort by Duration - Ant Design */}
              <div className="relative ant-select-custom">
                <Select
                  placeholder="Sort by Duration"
                  value={filters.duration || undefined}
                  onChange={(val) => handleFilterChange("duration", val)}
                  className="w-full h-[50px] custom-antd-select"
                  suffixIcon={
                    <ChevronDown size={18} className="text-gray-900" />
                  }
                >
                  <Option value="">Sort by Duration</Option>
                  <Option value="24h">24 Hours</Option>
                  <Option value="1w">1 Week</Option>
                  <Option value="3w">3 Weeks</Option>
                </Select>
              </div>

              {/* Sort by Status - Ant Design */}
              <div className="relative ant-select-custom">
                <Select
                  placeholder="Sort by Status"
                  value={filters.status || undefined}
                  onChange={(val) => handleFilterChange("status", val)}
                  className="w-full h-[50px] custom-antd-select"
                  suffixIcon={
                    <ChevronDown size={18} className="text-gray-900" />
                  }
                >
                  <Option value="">Sort by Status</Option>
                  <Option value="Booked  ">Booked</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Cancelled">Cancelled</Option>
                  <Option value="Checked-In">Checked In</Option>
                </Select>
              </div>

              {/* Date From - Aapka Pehla Wala Custom Code */}
              <div className="relative w-full">
                <img
                  src={tablecalender}
                  alt="calendar"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-20"
                />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className="w-full bg-inpgraysecondary border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-700 font-medium focus:outline-none appearance-none custom-date-input"
                />
              </div>

              {/* Date To - Fixed handleFilterChange Key */}
              <div className="relative w-full">
                <img
                  src={tablecalender}
                  alt="calendar"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-20"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)} // Fixed key to dateTo
                  className="w-full bg-inpgraysecondary border border-gray-200 rounded-xl px-4 py-3 pr-12 text-gray-700 font-medium focus:outline-none appearance-none custom-date-input"
                />
              </div>

              <div className="lg:col-span-2 flex items-center justify-end gap-3">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-6 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all border border-gray-100"
                >
                  <RotateCcw size={16} /> Reset All Filters
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="px-10 py-3 bg-[#0061F2] text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all"
                >
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
          <thead className="">
            <tr>
              {checkbox && (
                <th className="w-10 border-b border-t border-r  border-dashed">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === data?.length && data?.length > 0
                    }
                    onChange={toggleAll}
                    className="checked:accent-blue"
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
    p-4 text-xs font-semibold uppercase tracking-wide text-blue
    border-b border-t  border-l border-dashed border-gray-200
    ${col.type === "status" ? "text-center" : ""}
    ${col.type === "actions" ? "text-right" : ""}
  `}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!Array.isArray(data) || data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns?.length + 1}
                  className="py-12 text-center text-sm text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data?.map((row, index) => {
                const uiHotelId = `#${BASE_HOTEL_CODE}-${String(
                  index + 1,
                ).padStart(2, "0")}`;

                const enrichedRow = { ...row, uiHotelId };

                return (
                  <tr
                    key={index}
                    className={`
    ${index % 2 === 0 ? "bg-white" : "bg-lightWhite"}
    hover:bg-blue-50 transition-colors
  `}
                  >
                    {checkbox && (
                      <td className="border-b border-t border-r border-dashed">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="checked:accent-blue"
                        />
                      </td>
                    )}

                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`p-4 text-sm border-b border-t  border-l border-dashed
                        ${col.type === "status" ? "text-center" : ""}
                        ${col.type === "actions" ? "text-right relative" : ""}
                      `}
                      >
                        {renderCell(enrichedRow, col, index)}

                        {/* ACTION DROPDOWN */}
                        {col.type === "actions" && rowActionOpen === index && (
                          <div className="absolute right-28 top-1/1 -translate-y-1/2 w-28 bg-white border rounded-lg shadow-lg z-50">
                            <button
                              onClick={() => {
                                setRowActionOpen(null);
                                navigate(`${path}/${row.id}`, {
                                  state: { lastId },
                                });
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setRowActionOpen(null);
                                navigate(`${path}/${row.id}`, {
                                  state: { lastId },
                                });
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => onDelete(row.id)}
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
