import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate add kiya
import { getHotelById } from '../../../services/hotel';
import { Edit3, Wifi, Coffee, Droplets, Wind, Star } from 'lucide-react';
import MatrixCard from '../../../components/MatrixCard';
import { ShopOutlined } from '@ant-design/icons';
import RoomOccupancyCard from '../../../components/RoomOccupation';
import BookingTable from "../../../components/RecentTable";

const HotelProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Navigation hook
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const res = await getHotelById(id);
        setHotel(res.data);
      } catch (err) {
        console.error("Hotel detail fetch karne mein error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHotelData();
  }, [id]);

  // Update logic function
  const handleEditClick = () => {
  // Aapke routes file ke mutabiq path 'hotel-edit' hai
  navigate(`/admin/hotel-edit/${id}`); 
};

  if (loading) return <div className="p-20 text-center text-blue-600 font-bold text-xl tracking-wider animate-pulse">Loading Hotel Profile...</div>;
  if (!hotel) return <div className="p-20 text-center text-red-500 font-bold">Hotel Not Found!</div>;

  return (
    <>
      <div className="w-full bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 font-sans">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-bold text-[#1B2559]">Hotel Profile</h3>
          
          {/* Edit Button linked to handleEditClick */}
          <button 
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-[#2563EB] hover:text-white transition-all duration-300"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
          <div className="w-full lg:w-[280px] h-[180px] shrink-0">
            <img 
              src={hotel.img || "https://images.unsplash.com/photo-1566073771259-6a8506099945"} 
              className="w-full h-full rounded-[16px] object-cover shadow-sm border border-gray-100" 
              alt={hotel.name} 
            />
          </div>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-4 border-r-0 md:border-r border-gray-100 pr-4">
              <h1 className="text-[28px] font-bold text-[#1B2559] leading-tight capitalize">{hotel.name}</h1>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[#8B95B7] text-sm font-medium">{hotel.city}, {hotel.country}</span>
                <div className="flex text-yellow-400 ml-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <span className="bg-[#DBE9FF] text-[#0A5BE2] px-3 py-2 rounded-full text-xs font-bold uppercase">ID: {id.slice(-5)}</span>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${hotel.status === 'Active' ? 'bg-[#A5E3B8] text-[#2D6A4F]' : 'bg-red-100 text-red-600'}`}>
                  {hotel.status || 'Active'}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-5 px-0 md:px-4">
              <div>
                <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Hotel Address</p>
                <p className="font-bold text-[13px] text-[#1B2559]">{hotel.address}</p>
              </div>
              <div>
                <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Cancellation Policy</p>
                <p className="font-bold text-[13px] text-[#1B2559]">{hotel.cancellation_policy || "No Policy Set"}</p>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <div>
                <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Contact Email</p>
                <p className="font-bold text-[13px] text-[#1B2559]">{hotel.email}</p>
              </div>
              <div>
                <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Price Per Night</p>
                <p className="font-bold text-[18px] text-[#2563EB]">${hotel.pricePerNight || hotel.price_per_night}</p>
              </div>
            </div>
          </div>
        </div>

        <MatrixCard showShadow={false} icon={ShopOutlined}/>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Dynamic data binding example for Rooms */}
        <RoomOccupancyCard
          data={[
            { label: "One Bed Rooms", used: 18, total: 25 },
            { label: "Two Bed Rooms", used: 32, total: 45 },
            { label: "Three Bed Rooms", used: 14, total: 20 },
            { label: "Luxury Suites", used: 8, total: 10 },
          ]}
        />
      </div>

      <div className="min-h-[400px] mt-6 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <h3 className="text-[18px] font-bold text-[#1B2559] mb-4">Recent Bookings</h3>
        <BookingTable bookingsData={[]} />
      </div>
    </>
  );
};

export default HotelProfile;