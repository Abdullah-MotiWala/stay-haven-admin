import React, { useState } from "react";
import { MoreVertical, Filter, ChevronDown, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BASE_HOTEL_CODE, DEFAULT_IMAGE } from "../../shared/constant";

const HotelDirectory = ({
  data = [],
  columns = [],
  onDelete,
  onImportCSV,
  filter = true,
  title = "Directory",
}) => {
  const navigate = useNavigate();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [rowActionOpen, setRowActionOpen] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-blue-100 text-blue-600";
      case "Deleted":
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
        return "bg-lightGreenOne text-black";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRowStatus = (row) => {
    if (row.isDeleted) return "Deleted";
    if (row.isActive === true) return "Active";
    if (row.isActive === false) return "Inactive";
    return row.status;
  };

  // 🔥 CELL RENDERER (CORE LOGIC)
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

      case "computed":
        return row.totalRooms && row.availableRooms
          ? row.totalRooms - row.availableRooms
          : "-";

      case "fallback":
        return "-";

      case "dateRange":
        return (
          <span className="text-sm text-gray-900">
            {row.checkIn && row.checkOut
              ? `${row.checkIn} - ${row.checkOut}`
              : "-"}
          </span>
        );

      case "status":
        const status = getRowStatus(row);
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
              status
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

  return (
    <div className="w-full bg-white rounded-xl">
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
                  {["Activate Selected", "Export Selected", "Delete"].map(
                    (item) => (
                      <button
                        key={item}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              onClick={onImportCSV}
              className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2"
            >
              <Upload size={16} />
              Import / Export CSV
            </button>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-10 border-b border-dashed">
                <input type="checkbox" />
              </th>

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 text-xs font-semibold uppercase tracking-wide text-blue
                    border-b border-dashed
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
            {data.map((row, index) => {
              const uiHotelId = `#${BASE_HOTEL_CODE}-${String(
                index + 1
              ).padStart(2, "0")}`;

              const enrichedRow = { ...row, uiHotelId };

              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b border-dashed">
                    <input type="checkbox" />
                  </td>

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`p-4 text-sm border-b border-dashed
                        ${col.type === "status" ? "text-center" : ""}
                        ${col.type === "actions" ? "text-right relative" : ""}
                      `}
                    >
                      {renderCell(enrichedRow, col, index)}

                      {/* ACTION DROPDOWN */}
                      {col.type === "actions" && rowActionOpen === index && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-28 bg-white border rounded-lg shadow-lg z-50">
                          <button
                            onClick={() => {
                              setRowActionOpen(null);
                              navigate(`/admin/hotel/view/${row.id}`, {
                                state: { uiHotelId },
                              });
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            View
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelDirectory;
