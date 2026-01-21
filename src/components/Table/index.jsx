import React, { useState } from "react";
import { MoreVertical, Filter, ChevronDown, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_HOTEL_CODE, DEFAULT_IMAGE } from "../../shared/constant";
import { bulkActionApi } from "../../services/hotel";
import { openNotification } from "../../network/notification";
import { exportToExcel } from "../../utils/exportExcel";
import { deriveBookingStatus } from "../../helper";

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
}) => {
  const navigate = useNavigate();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [rowActionOpen, setRowActionOpen] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);

  const getStatusStyle = (status) => {
    console.log(status, "status12sadasd");
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
      case "Draft":
        return "bg-red-100 text-red-600";
      case "Checked-In":
        return "bg-lightYellow text-black";
      case "Checked-Out":
        return "bg-shadeGreen text-black";
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
    console.log(row, "rowrow1234");
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
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((row) => row.id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      openNotification("info", "Please select at least one row");
      return;
    }

    const payload = {
      ids: selectedIds,
      action, // ACTIVATE | DEACTIVATE | DELETE
    };

    console.log("Bulk action payload:", payload);

    try {
      console.log("Bulk payload:", payload);
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
        ? data.filter((row) => selectedIds.includes(row.id))
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
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center
      ${getRoomTypeStyle(row.roomType)}`}
          >
            {row.roomType ?? "N/A"}
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

      case "status":
        const status = getRowStatus(row);
        console.log(status, "statusstatusstatus");
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
              status,
            )}`}
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

  return (
    <div className="w-full ">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        {filter && (
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50">
              <Filter size={16} />
            </button>

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
                        handleBulkAction(item.split(" ")[0].toUpperCase());
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

            <button
              onClick={handleExportExcel}
              className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2"
            >
              <Upload size={16} />
              Import / Export CSV
            </button>
          </div>
        )}

        {view && (
          <button className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2">
            View
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="">
            <tr>
              <th className="w-10 border-b border-t border-r  border-dashed">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === data.length && data.length > 0
                  }
                  onChange={toggleAll}
                  className="checked:accent-blue"
                />
              </th>

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
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-12 text-center text-sm text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
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
                    <td className="border-b border-t border-r border-dashed">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="checked:accent-blue"
                      />
                    </td>

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
                                navigate(`/admin/hotel/view/${row.id}`, {
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
                                navigate(`/admin/hotel/edit/${row.id}`, {
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






