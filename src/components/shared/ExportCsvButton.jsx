import { Upload } from "lucide-react";
import { exportToCsv } from "../../utils/exportCsv";
import { openNotification } from "../../network/notification";

const ExportCsvButton = ({ data = [], columns = [], fileName = "export.csv", className }) => {
  const handleClick = () => {
    if (!data?.length) {
      openNotification("info", "No data to export");
      return;
    }
    exportToCsv({ data, columns, fileName });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "px-4 py-2 border rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"
      }
    >
      <Upload size={16} /> Export CSV
    </button>
  );
};

export default ExportCsvButton;
