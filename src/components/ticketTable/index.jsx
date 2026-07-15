import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Select } from "antd";
import ExportCsvButton from "../shared/ExportCsvButton";

const TICKET_EXPORT_COLUMNS = [
  { key: "ticketId", label: "Ticket ID" },
  { key: "userName", label: "User Name", getValue: (t) => t.userName || t.user?.name || "" },
  { key: "subject", label: "Subject" },
  { key: "dateCreated", label: "Date Created" },
  { key: "status", label: "Status" },
  { key: "lastUpdate", label: "Last Update" },
];

const TicketTable = ({ tickets, setSearchTerm, setStatusFilter, loading }) => { 
  const navigate = useNavigate(); 
  const { Option } = Select;

  return (
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        
        <div className="bg-[#F8F9FA] px-6 py-4 border-b border-gray-100 shadow-sm flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Tickets</h2>
          <div className="flex items-center gap-3">
            {loading && <span className="text-sm text-blue-500 animate-pulse">Updating...</span>}
            <ExportCsvButton data={tickets} columns={TICKET_EXPORT_COLUMNS} fileName="tickets.csv" />
          </div>
        </div>

        <div className="p-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search by ID or Subject..." 
                onChange={(e) => setSearchTerm(e.target.value)} // Connect to TicketsPage state
                className="w-full placeholder-dark border-[#E9E9E9] border-2 pl-4 pr-10 py-2 bg-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-gray-300 outline-none"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
            </div>
            
            <Select 
              placeholder="Select Status"
              onChange={(val) => setStatusFilter(val)} // Connect to TicketsPage state
              className="flex items-center border-[#E9E9E9] border-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all outline-none"
              showSearch
            >
              <Option value="All Tickets">All Tickets</Option>
              <Option value="Open">Open</Option>
              <Option value="Closed">Closed</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA]">
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase rounded-l-full">Ticket ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">User Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Subject</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Date Created</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Last Update</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase rounded-r-full text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tickets && tickets.length > 0 ? (
                  tickets.map((ticket, index) => (
                    <tr key={ticket.id || index} className="hover:bg-gray-50/50 border-b border-dashed border-gray-300">
                      <td className="px-6 py-5 text-md font-medium text-dark">{ticket.ticketId}</td>
                      <td className="px-6 py-5 text-md font-medium text-dark">{ticket.userName || ticket.user?.name || "—"}</td>
                      <td className="px-6 py-5 text-md font-medium text-dark max-w-xs truncate">{ticket.subject}</td>
                      <td className="px-6 py-5 text-md font-medium text-dark">{ticket.dateCreated}</td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1 rounded-md text-xs font-medium ${
                          ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 
                          ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">{ticket.lastUpdate}</td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => navigate(`/admin/tickets/${ticket.id}/chat`)}
                          className="p-2 bg-[#E0ECFF] text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-400 text-lg">
                      {loading ? "Searching..." : "No tickets found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default TicketTable;