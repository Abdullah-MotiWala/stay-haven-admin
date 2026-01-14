import React from 'react';
import { Edit3, Wifi, Coffee, Droplets, Wind, BedDouble, Star } from 'lucide-react';
import MatrixCard from '../../../components/MatrixCard';
import { ShopOutlined } from '@ant-design/icons';
import RoomOccupancyCard from '../../../components/RoomOccupation';
import RevenueDashboard from '../../../components/RevenueSnapshot';
import BookingTable from "../../../components/RecentTable"
const HotelProfile = () => {
  const stats = [
    { label: "Total Rooms", value: "120", bgColor: "bg-[#F4F9F1]", iconColor: "text-[#87B66D]", iconBg: "bg-[#E2EECF]" },
    { label: "Occupied", value: "84", bgColor: "bg-[#F2F9FF]", iconColor: "text-[#5B92AD]", iconBg: "bg-[#D9E9F2]" },
    { label: "Available Rooms", value: "34", bgColor: "bg-[#F9F5FF]", iconColor: "text-[#9B87B6]", iconBg: "bg-[#E9E1F2]" },
    { label: "In maintenance", value: "02", bgColor: "bg-[#F5F6FA]", iconColor: "text-[#8E95B6]", iconBg: "bg-[#E3E6F2]" },
  ];
  const dummyData = [
    { id: 1, bookingId: "#321-02", guestName: "Muhammad Akbar Ali Khan Iqbal", roomType: "Deluxe", roomNumber: "Room 101", duration: "3 nights", dates: "Jan 02, 2026 - Jan 05 2026", status: "Checked-In" },
    { id: 2, bookingId: "#321-02", guestName: "Sara Iqbal", roomType: "Standard", roomNumber: "Room 202", duration: "2 nights", dates: "Jan 02, 2026 - Jan 05 2026", status: "Checked-In" },
    { id: 3, bookingId: "#321-02", guestName: "Alexander James William Robert Smith", roomType: "Deluxe", roomNumber: "Room 300", duration: "1 night", dates: "Jan 02, 2026 - Jan 05 2026", status: "Checked-Out" },
    { id: 4, bookingId: "#321-02", guestName: "Sophia Grace", roomType: "Deluxe", roomNumber: "Room 119", duration: "3 nights", dates: "Jan 02, 2026 - Jan 05 2026", status: "Checked-Out" },
    { id: 5, bookingId: "#321-02", guestName: "Benjamin Thomas Edward Samuel Brown", roomType: "Standard", roomNumber: "Room 210", duration: "2 nights", dates: "Jan 02, 2026 - Jan 05 2026", status: "Checked-In" },
  ];


const chartData = [
  { name: '1', revenue: 80, isActive: false },
  { name: '2', revenue: 20, isActive: false },
  { name: '3', revenue: 30, isActive: false },
  { name: '4', revenue: 15, isActive: false },
  { name: '5', revenue: 40, isActive: false },
  { name: '6', revenue: 85, isActive: false },
  { name: '7', revenue: 25, isActive: true }, // Highlighted blue bar
  { name: '8', revenue: 35, isActive: false },
  // ... aise 30 entries add kar sakte hain
];
  return (
    <>
    <div className="w-full bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-[#1B2559]">Hotel Profile</h3>
        <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
          <Edit3 size={14} /> Edit
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
        {/* Hotel Image */}
        <div className="w-full lg:w-[280px] h-[180px] shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945" 
            className="w-full h-full rounded-[16px] object-cover shadow-sm" 
            alt="Hotel" 
          />
        </div>

        {/* Info Grid */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Title and Badge Section */}
          <div className="md:col-span-4 border-r-0 md:border-r border-gray-100 pr-4">
            <h1 className="text-[28px] font-bold text-[#1B2559] leading-tight">Grand Plaza Hotel</h1>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[#8B95B7] text-sm font-medium">Karachi, Pakistan</span>
              <div className="flex text-yellow-400 ml-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="bg-[#DBE9FF] text-[#0A5BE2] px-3 py-2 rounded-full text-xs font-bold">#321-01</span>
              <div className="flex items-center gap-2 bg-[#A5E3B8] text-[#2D6A4F] px-4 py-1.5 rounded-full text-xs font-bold">
                Active <span className="text-[10px]">▼</span>
              </div>
            </div>
          </div>

          {/* Address & Policy */}
          <div className="md:col-span-4 flex flex-col gap-5 px-0 md:px-4">
            <div>
              <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Hotel Address</p>
              <p className="font-bold text-[13px] text-[#1B2559]">Main Shahra-e-Faisal, Karachi</p>
            </div>
            <div>
              <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Cancellation Policy</p>
              <p className="font-bold text-[13px] text-[#1B2559]">Upto 24 hours before checkin</p>
            </div>
          </div>

          {/* Email & Amenities */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div>
              <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Email</p>
              <p className="font-bold text-[13px] text-[#1B2559]">info@grandplazahotel.com</p>
            </div>
            <div>
              <p className="text-[#8B95B7] text-[10px] uppercase font-bold tracking-wider mb-1">Amenities included</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { icon: <Wifi size={12}/>, label: "Free WiFi" },
                  { icon: <Coffee size={12}/>, label: "Breakfast" },
                  { icon: <Droplets size={12}/>, label: "Pool" },
                  { icon: <Wind size={12}/>, label: "Cold/Warm water" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col p-1 items-center justify-center bg-[#F8F9FD]  rounded-lg min-w-[75px]">
                    <span className="text-[#4A5568] mb-1">{item.icon}</span>
                    <span className="text-[8px] font-bold text-[#8B95B7] text-center uppercase whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section (Matrix) */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} p-6 rounded-[20px] flex justify-between items-start relative overflow-hidden`}>
            <div>
              <p className="text-[#1B2559] text-xs font-bold mb-6">{stat.label}</p>
              <h4 className="text-[32px] font-bold text-[#1B2559]">{stat.value}</h4>
            </div>
            <div className={`${stat.iconBg} ${stat.iconColor} p-2 rounded-lg`}>
              <BedDouble size={18} />
            </div>
          </div>
        ))}
      </div> */}
      <MatrixCard showShadow={false} icon={ShopOutlined}/>
    </div>
  <div
  className="
    grid 
    grid-cols-1 
    lg:grid-cols-1 
    gap-6
  "
>
  <RoomOccupancyCard
    data={[
      { label: "One Bed Rooms", used: 18, total: 25 },
      { label: "Two Bed Rooms", used: 32, total: 45 },
      { label: "Three Bed Rooms", used: 14, total: 20 },
      { label: "Luxury Suites", used: 8, total: 10 },
    ]}
  />

  {/* <RevenueDashboard /> */}
</div>

    <div className="min-h-screen">
      <BookingTable bookingsData={dummyData} />
    </div>
 
    </>
  );
};

export default HotelProfile;  