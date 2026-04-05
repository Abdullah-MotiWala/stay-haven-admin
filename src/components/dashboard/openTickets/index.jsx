// import { Select, Dropdown, Menu } from "antd";
// import Card from "../card";
// import { ChevronDown } from "lucide-react";
// import TicketStatusDropdown from "./ticketStatusDropdown";
// import { updateTicketStatus } from "../../../services/chat";
// import Client1 from '../../../assets/images/client1.png'
// import Client2 from '../../../assets/images/client2.png'

// const { Option } = Select;



// const dddddddddddddddddddddddddddddddddddddddddddddddd/*  */ = [
//   { key: "open", label: "Open" },
//   { key: "in_progress", label: "In Progress" },
//   { key: "closed", label: "Closed" },
// ];
// const tickets = [
//   {
//     id: "#321-02",
//     name: "Ahmed Ali",
//     issue: "Payment failed during checkout",
//     date: "01 Aug 2024",
//     avatar: "https://i.pravatar.cc/100?img=12",
//     status: "open",
//   },
//   {
//     id: "#321-02",
//     name: "Ahmed Ali",
//     issue: "Booking confirmation not received",
//     date: "01 Aug 2024",
//     avatar: "https://i.pravatar.cc/100?img=15",
//     status: "open",
//   },
// ];

// const OpenTickets = ({ OpenTickets: ticketsData }) => {
//   const displayTickets = ticketsData || [];
//   return (
//     <Card
//       title="Open Tickets"
//       right={
//         <Select
//           size="small"
//           defaultValue="week"
//           options={[{ label: "This week", value: "week" }]}
//         />
//       }
//     >
//       <style>{`
//         .red-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .red-scrollbar::-webkit-scrollbar-track {
//           background: #fff1f1;
//           border-radius: 10px;
//         }
//         .red-scrollbar::-webkit-scrollbar-thumb {
//           background: #ef4444;
//           border-radius: 10px;
//         }
//         .red-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #dc2626;
//         }
//         .red-scrollbar {
//           scrollbar-width: thin;
//           scrollbar-color: #ef4444 #fff1f1;
//         }
//       `}</style>
//       <div className="red-scrollbar space-y-6">
//         {displayTickets.map((ticket, index) => (
//           <div
//             key={index}
//             className="bg-white rounded-2xl border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-6 py-6"
//           >
//             <div className="flex flex-row justify-between">
//               <div>
//                 <span className="inline-block bg-lightGrays font-normal   text-sm px-3 py-1 rounded-lg mb-4">
//                   Ticket ID: {ticket.id.substring(0, 8).toUpperCase()}
//                 </span>
//               </div>
//               <div>
          
//                 <TicketStatusDropdown
//                   value={ticket.status}
//                   onChange={(status) => updateTicketStatus(ticket.id, status)}
//                 />
//               </div>
//             </div>

//             <div className="flex justify-between dddddddddddddddddddddddddddddddddddddddddddddddd/*  */-start">
//               <div>
//                 <div className="flex gap-4">
//                   <img
//                     src={Client2}
//                     alt=""
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
          
//                   <div className="flex flex-col gap-0 ">
//                     <p className="font-medium  m-0 ">{ticket.user?.name || "Customer"}</p>
//                     <p className="text-sm ">{ticket.id.substring(0, 8)}</p>
//                     <div></div>
//                   </div>
//                 </div>
//                 <p className="text-sm font-medium text-extradark m-0mt-2">
//                   {ticket.description }
//                 </p>
//               </div>

//               <div className="flex flex-col dddddddddddddddddddddddddddddddddddddddddddddddd/*  */-end gap-3 min-w-[140px]">
//                 {/* 🔹 DATE */}
//                 {/* <div className="text-right"> */}
//                 {/* 🔹 STATUS DROPDOWN */}
//                 <div className="flex flex-col gap-0 ">
//                   <p className="text-sm text-blue font-medium m-0">
//                     Ticket Date
//                   </p>
//                   <p className="text-sm font-medium text-extradark m-0">
//                     {ticket.date}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// };

// export default OpenTickets;

import { Select, Dropdown, Menu } from "antd";
import Card from "../card";
import { ChevronDown } from "lucide-react";
import TicketStatusDropdown from "./ticketStatusDropdown";
import { updateTicketStatus } from "../../../services/chat";
import Client1 from '../../../assets/images/client1.png'
import Client2 from '../../../assets/images/client2.png'

const { Option } = Select;

const dddddddddddddddddddddddddddddddddddddddddddddddd/*  */ = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "closed", label: "Closed" },
];

const OpenTickets = ({ OpenTickets: ticketsData }) => {
  const displayTickets = ticketsData || [];
  return (
    <Card
      title="Open Tickets"
      // right={
      //   <Select
      //     size="small"
      //     defaultValue="week"
      //     options={[{ label: "This week", value: "week" }]}
      //   />
      // }
    >
      <style>{`
        .red-scrollbar::-webkit-scrollbar { width: 6px; }
        .red-scrollbar::-webkit-scrollbar-track { background: #fff1f1; border-radius: 10px; }
        .red-scrollbar::-webkit-scrollbar-thumb { background: #ef4444; border-radius: 10px; }
        .red-scrollbar::-webkit-scrollbar-thumb:hover { background: #dc2626; }
        .red-scrollbar { scrollbar-width: thin; scrollbar-color: #ef4444 #fff1f1; }
      `}</style>

      <div
        className="red-scrollbar space-y-6 overflow-y-auto pr-2"
        style={{ maxHeight: "420px" }}
      >
        {displayTickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-lightSeconday shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-4 py-4"
          >
            {/* Top Row: Ticket ID + Status */}
            <div className="flex flex-wrap justify-between dddddddddddddddddddddddddddddddddddddddddddddddd/*  */-center gap-2 mb-4">
              <span className="inline-block bg-lightGrays font-normal text-sm px-3 py-1 rounded-lg">
                Ticket ID: {ticket.id.substring(0, 8).toUpperCase()}
              </span>
              <TicketStatusDropdown
                value={ticket.status}
                onChange={(status) => updateTicketStatus(ticket.id, status)}
              />
            </div>

            {/* Bottom Row: Avatar+Name LEFT, Date RIGHT */}
            <div className="flex flex-wrap justify-between dddddddddddddddddddddddddddddddddddddddddddddddd/*  */-start gap-3">
              {/* Left: Avatar + Name + Description */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex gap-3 dddddddddddddddddddddddddddddddddddddddddddddddd/*  */-center">
                  <img
                    src={Client2}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="font-medium m-0 truncate">
                      {ticket.user?.name || "Customer"}
                    </p>
                    <p className="text-sm m-0 truncate">
                      {ticket.id.substring(0, 8)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-extradark m-0 break-words">
                  {ticket.description}
                </p>
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
              <div className="flex flex-col dddddddddddddddddddddddddddddddddddddddddddddddd/*  */-end gap-0 flex-shrink-0">
                <p className="text-sm text-blue font-medium m-0">
                  Ticket Date
                </p>
                <p className="text-sm font-medium text-extradark m-0 whitespace-nowrap">
                  {ticket.date}
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