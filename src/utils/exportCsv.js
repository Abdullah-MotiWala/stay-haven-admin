import { deriveBookingStatus } from "../helper";

const escapeCsv = (value) => {
  const str = value == null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
};

export const getExportCellValue = (row, col) => {
  if (typeof col.getValue === "function") {
    return col.getValue(row) ?? "";
  }

  const key = col.key || col.accessorKey;

  switch (col.type) {
    case "hotel":
    case "hotelCell":
      return row.hotelName || row.hotel?.name || row.name || "";
    case "roomType": {
      const typeLabel =
        typeof row.roomType === "object" ? row.roomType?.title : row.roomType;
      return typeLabel ?? "";
    }
    case "dateRange":
      return row.checkInOut ?? "";
    case "status": {
      const s = row.status?.toLowerCase();
      if (s === "cancelled" || s === "canceled") return "Cancelled";
      if (s === "checked-in" || s === "checkin") return "Checked-In";
      if (s === "checked-out" || s === "checkout") return "Checked-Out";
      if (s === "completed") return "Completed";
      if (s === "booked") return "Booked";
      if (s === "reserved") return "Reserved";
      if (row.isDeleted) return "Deleted";
      if (s === "active") return "Active";
      if (s === "available") return "Available";
      if (s === "occupied") return "Occupied";
      if (s === "maintenance") return "Maintenance";
      if (s === "deactivate" || s === "inactive") return "Inactive";
      if (s === "draft") return "Draft";
      if (!s && row.checkInOut) return deriveBookingStatus(row.checkInOut);
      return row.status ?? "";
    }
    case "computed":
      return row.totalRooms != null && row.availableRooms != null
        ? row.totalRooms - row.availableRooms
        : "";
    case "number":
      return row[key] ?? 0;
    default:
      return row[key] ?? "";
  }
};

export const exportToCsv = ({
  data = [],
  columns = [],
  fileName = "export.csv",
}) => {
  const exportableCols = columns.filter((col) => col.type !== "actions");

  if (exportableCols.length === 0 || data.length === 0) {
    return false;
  }

  const headers = exportableCols.map(
    (col) => col.label || col.key || col.title || col.accessorKey || ""
  );
  const rows = data.map((item) =>
    exportableCols
      .map((col) => escapeCsv(getExportCellValue(item, col)))
      .join(",")
  );

  const csvContent = "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

export const slugifyFileName = (title, fallback = "export") => {
  const slug = (title || fallback)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `${slug || fallback}.csv`;
};
