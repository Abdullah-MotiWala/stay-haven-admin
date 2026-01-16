import React from 'react';

const TicketTable = (e) => {
const { tickets } = e;
  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100  overflow-hidden">
        
        {/* Tickets Heading Section with Gray BG & Shadow */}
        <div className="bg-[#F8F9FA] px-6 py-4 border-b border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800">Tickets</h2>
        </div>

        <div className="p-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full placeholder-dark border-[#E9E9E9] border-2 pl-4 pr-10 py-2 bg-gray-100  rounded-xl text-sm focus:ring-1 focus:ring-gray-300"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
            </div>
            
            <button className="flex items-center border-[#E9E9E9] border-2 gap-2 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all">
              All Tickets / Open / Closed
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {/* Table with Rounded Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] ">
                  {/* Pehla aur Akhri TH rounded kiya gaya hai */}
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase rounded-l-full">Ticket ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">User Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Subject</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Date Created</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase">Last Update</th>
                  <th className="px-6 py-4 text-xs font-bold text-dark uppercase rounded-r-full text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50   rounded-b-2xl">
                {tickets.map((ticket, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 border-b border-6 border-dashed border-gray-300">
                    <td className="px-6 py-5 text-md font-medium text-dark">{ticket.id}</td>
                    <td className="px-6 py-5 text-md font-medium text-dark">{ticket.userName}</td>
                    <td className="px-6 py-5 text-md font-medium text-dark max-w-xs truncate">{ticket.subject}</td>
                    <td className="px-6 py-5 text-md font-medium text-dark">{ticket.date}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1 rounded-md text-xs font-medium ${
                        ticket.status === 'Open' 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-gray-200 text-gray-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-500">{ticket.lastUpdate}</td>
                    <td className="px-6 py-5 text-center ">
                      <button className="p-2 bg-[#E0ECFF] text-blue rounded-md hover:bg-blue-100">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketTable;