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
      menu={{
        items,
        onClick: ({ key }) => onChange(key),
      }}
    >
      <div className="status-pill">
        <span className="status-text">{getLabel()}</span>
        <div className="status-arrow">
          <ChevronDown size={24} />
        </div>
      </div>
    </Dropdown>
  );
};

export default TicketStatusDropdown;
