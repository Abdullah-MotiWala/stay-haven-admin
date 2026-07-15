import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";

const TicketStatusDropdown = ({ value, onChange }) => {
  const items = [
    { key: "Open", label: "Open" },
    { key: "Pending", label: "Pending" },
    { key: "Closed", label: "Closed" },
  ];

  const getLabel = () => {
    if (value === "Open") return "Open";
    if (value === "Pending") return "Pending";
    if (value === "Closed") return "Closed";
    return value || "Open";
  };

  return (
    <Dropdown
      trigger={["click"]}
      overlayClassName="custom-dropdown"
      menu={{
        items,
        onClick: ({ key }) => onChange(key),
      }}
     
    >
      <div className="status-pill cursor-pointer flex items-center gap-1 bg-gray-200 rounded">
        <span className="status-text pl-0">{getLabel()}</span>
        <div className="status-arrow bg-transparent">
          <ChevronDown size={16} />
        </div>
      </div>
    </Dropdown>
  );
};

export default TicketStatusDropdown;
