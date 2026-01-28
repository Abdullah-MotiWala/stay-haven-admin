import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";

const TicketStatusDropdown = ({ value, onChange }) => {
  const items = [
    { key: "open", label: "Open" },
    { key: "in_progress", label: "In Progress" },
    { key: "closed", label: "Closed" },
  ];

  const getLabel = () => {
    if (value === "open") return "Open";
    if (value === "in_progress") return "In Progress";
    return "Closed";
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
