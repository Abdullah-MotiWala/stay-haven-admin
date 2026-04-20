import { useState } from "react";
import Card from "../card";
import TicketStatusDropdown from "./ticketStatusDropdown";
import { updateTicketStatus } from "../../../services/chat";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import { openNotification } from "../../../network/notification";

const OpenTickets = ({ OpenTickets: ticketsData, onRefresh }) => {
  const displayTickets = ticketsData || [];
  const [loadingId, setLoadingId] = useState(null);

  const handleStatusChange = async (ticketId, status) => {
    setLoadingId(ticketId);
    try {
      await updateTicketStatus(ticketId, status);
      openNotification("success", `Status updated to ${status}`);
      onRefresh && onRefresh();
    } catch {
      openNotification("error", "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card title="Open Tickets">
      <style>{`
        .red-scrollbar::-webkit-scrollbar { width: 6px; }
        .red-scrollbar::-webkit-scrollbar-track { background: #fff1f1; border-radius: 10px; }
        .red-scrollbar::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 10px; }
        .red-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
        .red-scrollbar { scrollbar-width: thin; scrollbar-color: #ef4444 #fff1f1; }
      `}</style>

      <div className="red-scrollbar space-y-6 overflow-y-auto pr-2" style={{ maxHeight: "420px" }}>
        {displayTickets.map((ticket, index) => (
          <div
            key={ticket.id || index}
            className={`bg-white rounded-2xl border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-4 py-4 transition-opacity ${loadingId === ticket.id ? "opacity-60 pointer-events-none" : ""}`}
          >
            {/* Top Row: Ticket ID + Status */}
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <span className="inline-block bg-lightGrays font-normal text-sm px-3 py-1 rounded-lg">
                Ticket ID: {ticket.ticketId || ticket.id?.substring(0, 8).toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                {loadingId === ticket.id && (
                  <div className="w-4 h-4 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                )}
                <TicketStatusDropdown
                  value={ticket.status}
                  onChange={(status) => handleStatusChange(ticket.id, status)}
                />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-wrap justify-between items-start gap-3">
              {/* Left: Avatar + Name + Description */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex gap-3 items-center">
                  <img
                    src={ticket.user?.profileImage || DEFAULT_IMAGE}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="font-medium m-0 truncate">
                      {ticket.user?.name || "Customer"}
                    </p>
                    <p className="text-sm m-0 truncate text-gray-400">
                      {ticket.ticketId || ticket.id?.substring(0, 8)}
                    </p>
                  </div>
                </div>
                {ticket.description && (
                  <p className="text-sm font-medium text-extradark m-0 break-words">
                    {ticket.description}
                  </p>
                )}
                {ticket.attachments?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-1">
                    {ticket.attachments.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        <img src={url} alt="attachment" className="w-12 h-12 rounded-lg object-cover border border-gray-200 hover:opacity-80 transition" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Date */}
              <div className="flex flex-col items-end gap-0 flex-shrink-0">
                <p className="text-sm text-blue font-medium m-0">Ticket Date</p>
                <p className="text-sm font-medium text-extradark m-0 whitespace-nowrap">
                  {ticket.dateCreated || ticket.date || "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OpenTickets;
