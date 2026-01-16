import React, { useState } from 'react';
import { MoreVertical, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HotelDirectory = ({ data, onDelete }) => {
  const navigate = useNavigate();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [rowActionOpen, setRowActionOpen] = useState(null);

  const hotels = data || [];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Inactive': return 'bg-blue-100 text-blue-600';
      case 'Deleted': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="p-1 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">Hotels Directory</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter size={18} className="text-gray-500" /></button>
          <div className="relative">
            <button onClick={() => setBulkOpen(!bulkOpen)} className="px-4 py-2 border rounded-lg flex items-center gap-2 text-sm hover:bg-gray-50">
              Bulk Actions <ChevronDown size={16} />
            </button>
            {bulkOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                {["Activate Selected", "Export Selected", "Delete"].map((item) => (
                  <button key={item} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">{item}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-blue-50/30">
              <th className="p-4 w-10"><input type="checkbox" className="rounded accent-blue-600" /></th>
              <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Hotel ID</th>
              <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider">Hotel Name</th>
              <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider text-center">Status</th>
              <th className="p-4 text-xs font-bold text-blue-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {hotels.length > 0 ? hotels.map((hotel, index) => (
              <tr key={hotel.id || index} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4"><input type="checkbox" className="rounded" /></td>
                <td className="p-4 text-sm text-gray-600">#{hotel.id?.toString().slice(-5) || 'N/A'}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={hotel.img || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="text-sm font-bold text-gray-800">{hotel.name}</div>
                      <div className="text-xs text-gray-400">{hotel.location || 'Karachi, Pakistan'}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(hotel.status || 'Active')}`}>
                    {hotel.status || 'Active'}
                  </span>
                </td>
                <td className="p-4 text-right relative">
                  <button onClick={() => setRowActionOpen(rowActionOpen === index ? null : index)} className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                  {rowActionOpen === index && (
                    <div className="absolute right-4 top-10 w-40 bg-white border rounded-lg shadow-lg z-50">
                      {["View Details", "Edit Hotel", "Delete"].map((action) => (
                        <button key={action}

                        onClick={() => {
                        setRowActionOpen(null); // Menu band karein
                        if (action === "View Details") {
                          // URL format: /hotels/123 (Check karein aapka route yahi hai na?)
                          navigate(`/admin/hotel-view/${hotel.id}`); 
                        } else if (action === "Delete") {
                          // Yahan delete function call ho raha hai
                          onDelete(hotel.id); 
                        } else if (action === "Edit Hotel") {
                          navigate(`/admin/hotel-edit/${hotel.id}`);
                        }
                      }}
// ==============================================================================
                         className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">{action}</button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">No hotels found in database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelDirectory;