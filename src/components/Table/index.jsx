import React, { useState } from 'react';
import { MoreVertical, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const HotelDirectory = () => {
    const [bulkOpen, setBulkOpen] = useState(false);
const [rowActionOpen, setRowActionOpen] = useState(null);

  // Dummy Data - Isko aap props se bhi le sakte hain
  const hotels = [
    { id: '#321-01', name: 'Grand Plaza Hotel', location: 'Karachi', total: 120, available: 84, occupied: 18, reserved: 13, status: 'Active', img: 'https://via.placeholder.com/40' },
    { id: '#321-01', name: 'Ocean View Resort', location: 'Lahore', total: 120, available: 84, occupied: 18, reserved: 13, status: 'Active', img: 'https://via.placeholder.com/40' },
    { id: '#321-01', name: 'Mountain Lodge', location: 'Karachi', total: 120, available: 84, occupied: 18, reserved: 13, status: 'Inactive', img: 'https://via.placeholder.com/40' },
    { id: '#321-01', name: 'Urban Boutique', location: 'Lahore', total: 120, available: 84, occupied: 18, reserved: 13, status: 'Active', img: 'https://via.placeholder.com/40' },
    { id: '#321-01', name: 'Grand Plaza Hotel', location: 'Karachi', total: 120, available: 84, occupied: 18, reserved: 13, status: 'Deleted', img: 'https://via.placeholder.com/40' },
    { id: '#321-01', name: 'Riverside Inn', location: 'Karachi', total: 120, available: 84, occupied: 18, reserved: 13, status: 'Active', img: 'https://via.placeholder.com/40' },
    { id: '#321-01', name: 'Grand Plaza Hotel', location: 'Karachi', total: 120, available: 84, occupied: 18, reserved: 13, status: 'Active', img: 'https://via.placeholder.com/40' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-300 text-green-700';
      case 'Inactive': return 'bg-blue-100 text-blue-600';
      case 'Deleted': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="bg-white overflow-hidden">
        
        {/* Header Section */}
        <div className=" p-1 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">Hotels Directory</h2>
          
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter size={18} className="text-gray-500" /></button>
<div className="relative">
  <button
    onClick={() => setBulkOpen(!bulkOpen)}
    className="px-4 py-2 border rounded-lg flex items-center gap-2 text-sm hover:bg-gray-50"
  >
    Bulk Actions <ChevronDown size={16} />
  </button>

  {bulkOpen && (
    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
      {[
        "Activate Selected",
        "Deactivate Selected",
        "Mark as Deleted",
        "Export Selected",
        "Assign Category",
        "Archive",
      ].map((item) => (
        <button
          key={item}
          onClick={() => {
            setBulkOpen(false);
            console.log(item);
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          {item}
        </button>
      ))}
    </div>
  )}
</div>
            <button className="px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
              Import / Export CSV <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Table Container - Responsive scroll */}
        <div className="overflow-x-auto">
          <table className="border-dashed border-2 border-gray-200 w-full text-left">
            <thead >
              <tr className="border-y border-gray-100 text-blue border-dashed border-2 border-gray-50" >
                <th className="p-4 w-10"><input type="checkbox" className="rounded accent-blue-600" /></th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Hotel ID</th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Hotel Name</th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Total Rooms</th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Rooms Available</th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Rooms Occupied</th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Reserved</th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="border-dashed border-2 border-gray-200 divide-y divide-gray-50 ">
              {hotels.map((hotel, index) => (
                <tr key={index} className="border-dashed border-2 border-gray-200 even:bg-[#F8F9FA] hover:bg-gray-50/50 transition-colors ">
                  <td className="p-4"><input type="checkbox" className="rounded" /></td>
                  <td className="p-4 text-sm text-gray-600">{hotel.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={hotel.img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-sm font-bold text-gray-800">{hotel.name}</div>
                        <div className="text-xs text-gray-400">{hotel.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 text-center md:text-left">{hotel.total}</td>
                  <td className="p-4 text-sm text-gray-600 text-center md:text-left">{hotel.available}</td>
                  <td className="p-4 text-sm text-gray-600 text-center md:text-left">{hotel.occupied}</td>
                  <td className="p-4 text-sm text-gray-600 text-center md:text-left">{hotel.reserved}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(hotel.status)}`}>
                      {hotel.status}
                    </span>
                  </td>
                  <td className="p-4 text-right relative">
  <button
    onClick={() =>
      setRowActionOpen(rowActionOpen === index ? null : index)
    }
    className="text-gray-400 hover:text-gray-600"
  >
    <MoreVertical size={18} />
  </button>

  {rowActionOpen === index && (
    <div className="absolute right-4 top-12 w-40 bg-white border rounded-lg shadow-lg z-50">
      {[
        "View Details",
        "Edit Hotel",
        "Change Status",
        "Duplicate",
        "Delete",
      ].map((action) => (
        <button
          key={action}
          onClick={() => {
            setRowActionOpen(null);
            console.log(action, hotel.id);
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          {action}
        </button>
      ))}
    </div>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <select className="border rounded px-2 py-1 focus:outline-none">
              <option>10</option>
              <option>20</option>
            </select>
            <span>Entries per page</span>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18}/></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 text-sm">3</button>
            <span className="px-1 text-gray-400">....</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 text-sm">10</button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><ChevronRight size={18}/></button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HotelDirectory;