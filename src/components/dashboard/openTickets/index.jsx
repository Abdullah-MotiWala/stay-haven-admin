import { Select, Dropdown, Menu } from "antd";
import Card from "../card";
import { ChevronDown } from "lucide-react";
import TicketStatusDropdown from "./ticketStatusDropdown";

const { Option } = Select;

// 🔹 Mock API call
const updateTicketStatus = async (ticketId, status) => {
  console.log("API HIT →", { ticketId, status });
  // await api.patch(`/tickets/${ticketId}`, { status });
};

const items = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "closed", label: "Closed" },
];
const tickets = [
  {
    id: "#321-02",
    name: "Ahmed Ali",
    issue: "Payment failed during checkout",
    date: "01 Aug 2024",
    avatar: "https://i.pravatar.cc/100?img=12",
    status: "open",
  },
  {
    id: "#321-02",
    name: "Ahmed Ali",
    issue: "Booking confirmation not received",
    date: "01 Aug 2024",
    avatar: "https://i.pravatar.cc/100?img=15",
    status: "open",
  },
];

const OpenTickets = () => {
  return (
    <Card
      title="Open Tickets"
      right={
        <Select
          size="small"
          defaultValue="week"
          options={[{ label: "This week", value: "week" }]}
        />
      }
    >
      <div className="space-y-6">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-6 py-6"
          >
            <div className="flex flex-row justify-between">
              <div>
                <span className="inline-block bg-lightGrays font-normal   text-sm px-3 py-1 rounded-lg mb-4">
                  Ticket ID: {ticket.id}
                </span>
              </div>
              <div>
          
                <TicketStatusDropdown
                  value={ticket.status}
                  onChange={(status) => updateTicketStatus(ticket.id, status)}
                />
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-4">
                  <img
                    src={ticket.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex flex-col gap-0 ">
                    <p className="font-medium  m-0 ">{ticket.name}</p>
                    <p className="text-sm ">{ticket.id}</p>
                    <div></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-extradark m-0mt-2">
                  {ticket.issue}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-[140px]">
                {/* 🔹 DATE */}
                {/* <div className="text-right"> */}
                {/* 🔹 STATUS DROPDOWN */}
                <div className="flex flex-col gap-0 ">
                  <p className="text-sm text-blue font-medium m-0">
                    Ticket Date
                  </p>
                  <p className="text-sm font-medium text-extradark m-0">
                    {ticket.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OpenTickets;
