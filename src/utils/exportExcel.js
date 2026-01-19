import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = ({
  data,
  columns,
  fileName = "export.xlsx",
}) => {
  // remove non-exportable columns
  const exportableCols = columns.filter(
    (c) => !["actions"].includes(c.type)
  );

  const formattedData = data.map((row) => {
    const obj = {};

    exportableCols.forEach((col) => {
      switch (col.type) {
        case "hotel":
          obj[col.label] = row.name ?? "-";
          break;

        case "status":
          obj[col.label] =
            row.isDeleted
              ? "Deleted"
              : row.isActive
              ? "Active"
              : "Inactive";
          break;

        case "computed":
          obj[col.label] =
            row.totalRooms && row.availableRooms
              ? row.totalRooms - row.availableRooms
              : "-";
          break;

        default:
          obj[col.label] = row[col.key] ?? "-";
      }
    });

    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, fileName);
};
