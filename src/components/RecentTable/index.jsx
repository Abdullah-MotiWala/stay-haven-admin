import React, { useState } from 'react';

const BookingTable = ({ bookingsData = [] }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="w-full bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
        <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
      </div>

      {/* Responsive Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y border-dashed border-blue-100 bg-[#F8F9FA]">
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight">Booking ID</th>
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight">Guest Name</th>
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight">Room Type</th>
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight">Room Number</th>
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight text-center">Duration</th>
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight">Check-In & Check-Out</th>
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight text-center">Status</th>
              <th className="py-4 px-4 text-[13px] font-bold text-blue-600 uppercase tracking-tight text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashed divide-blue-50">
            {bookingsData.map((booking) => (
              <tr key={booking.id} className="odd:bg-white even:bg-[#F8F9FA] hover:bg-gray-200 border-dashed border-2  transition-colors group">
                <td className="py-5 px-4 text-sm font-bold text-blue-600 cursor-pointer hover:underline">
                  {booking.bookingId}
                </td>
                <td className=" py-5 px-4 text-sm font-semibold text-gray-700 max-w-[200px]">
                  {booking.guestName}
                </td>
                <td className="py-5 px-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    booking.roomType === 'Deluxe' 
                    ? 'bg-[#f8ffcc] text-[#111827]' 
                    : 'bg-[#e0f9f1] text-[#111827]'
                  }`}>
                    {booking.roomType}
                  </span>
                </td>
                <td className="py-5 px-4 text-sm font-medium text-gray-600">
                  {booking.roomNumber}
                </td>
                <td className="py-5 px-4 text-sm font-medium text-gray-600 text-center">
                  {booking.duration}
                </td>
                <td className="py-5 px-4 text-sm font-medium text-gray-500">
                  {booking.dates}
                </td>
                <td className="py-5 px-4 text-center">
                  <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold inline-block min-w-[100px] ${
                    booking.status === 'Checked-In' 
                    ? 'bg-[#f8ffcc] text-gray-800' 
                    : 'bg-[#e0f9f1] text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-5 px-4 text-right relative">
                  <button 
                    onClick={() => toggleMenu(booking.id)}
                    className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>

                  {/* 3 Dots Menu Dropdown */}
                  {openMenuId === booking.id && (
                    <div className="absolute right-8 top-12 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                      <button className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:bg-blue-50">Edit</button>
                      <button className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50">Cancel</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BookingTable

