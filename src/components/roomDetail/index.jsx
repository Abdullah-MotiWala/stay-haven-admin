import React from 'react';
import path from "../../assets/icons/Path.png"
import water from "../../assets/icons/water.png"
import pool from "../../assets/icons/pool.png"
import group from "../../assets/icons/group.png"
import gests from "../../assets/icons/gests.png"
import cardImage from "../../assets/images/cardImage.png"
import  { useState } from 'react';
import { Edit2, CheckCircle2, Wifi, Coffee, Droplets, Waves, Maximize, Bed, Users } from 'lucide-react';

function RoomDetail({ room }) {
  // Gallery Logic
  const gallery = [room.image, room.image, room.image, room.image, room.image]; 
  const displayImages = gallery.slice(0, 3);
  const hasMore = gallery.length > 4;

  return (
    <div className="w-full max-w-[950px] mx-auto bg-white p-4 md:p-8 rounded-[20px] md:rounded-[30px] shadow-sm font-sans overflow-hidden">
      
      {/* Top Header: Detail & Edit */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[#7C8DB5] text-xs md:text-sm font-medium uppercase tracking-wider">Room Details</span>
        <button className="flex items-center gap-2 border border-gray-200 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium hover:bg-gray-50 transition-all">
          <Edit2 size={14} /> Edit
        </button>
      </div>

      {/* Title & Pricing Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <h1 className="text-2xl md:text-[32px] font-bold text-[#111827] leading-tight">{room.title}</h1>
          <span className="bg-[#90E6A7] text-[#1A4D2E] px-2 py-0.5 md:px-3 md:py-1 rounded-md text-[10px] md:text-xs font-bold uppercase whitespace-nowrap">
            {room.status}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl md:text-[32px] font-bold text-[#111827]">${room.price}</span>
          <span className="text-[#7C8DB5] text-xs md:text-lg font-medium">/night</span>
        </div>
      </div>

      <p className="text-[#7C8DB5] flex items-center gap-1 mb-6 text-sm md:text-base">
        <span className="text-lg">📍</span> {room.view}
      </p>

      {/* Main Image & Gallery Grid - Fully Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="lg:col-span-3">
          <img 
            src={room.image} 
            alt="Main" 
            className="w-full h-[250px] md:h-[400px] object-cover rounded-[15px] md:rounded-[25px]" 
          />
        </div>
        {/* Sidebar Images: Hidden on mobile, shown on md+ */}
        <div className="hidden lg:flex flex-col gap-3">
          {displayImages.map((img, index) => (
            <img 
              key={index}
              src={img} 
              className="w-full h-[95px] object-cover rounded-[15px]" 
              alt="thumb"
            />
          ))}
          {hasMore && (
            <div className="relative w-full h-[95px] rounded-[15px] overflow-hidden group cursor-pointer">
              <img src={gallery[3]} className="w-full h-full object-cover" alt="More" />
              <div className="absolute inset-0 bg-[#A5C9FF]/90 flex items-center justify-center transition-colors group-hover:bg-[#A5C9FF]/100">
                <span className="text-[#1E40AF] font-bold text-sm">+{gallery.length - 4} more</span>
              </div>
            </div>
          )}
        </div>
        {/* Mobile Mini Gallery (Only visible on small screens) */}
        <div className="flex lg:hidden gap-2 overflow-x-auto pb-2">
            {gallery.slice(1, 5).map((img, i) => (
                <img key={i} src={img} className="w-20 h-20 shrink-0 object-cover rounded-lg" />
            ))}
        </div>
      </div>

      {/* Specs Icons */}
      <div className="flex flex-wrap gap-4 md:gap-8 mb-8 pb-6 border-b border-gray-100 text-[#7C8DB5]">
        <span className="flex items-center gap-2 text-sm md:text-base font-medium"><Maximize size={18}/> {room.size}</span>
        <span className="flex items-center gap-2 text-sm md:text-base font-medium"><Bed size={18}/> {room.bed}</span>
        <span className="flex items-center gap-2 text-sm md:text-base font-medium"><Users size={18}/> {room.guests}</span>
      </div>

      {/* Description */}
      <p className="text-[#4B5563] leading-relaxed mb-10 text-sm md:text-[16px]">
        {room.description}
      </p>

      {/* Features & Amenities - Stack on Mobile, Grid on Tablet/Laptop */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
        {/* Features */}
        <section>
          <h3 className="text-lg md:text-xl font-bold mb-5 text-[#111827]">Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {["Designed with a spacious layout", "Private balcony", "Dedicated workspace", "Comfortable stay"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-[13px] md:text-sm font-semibold text-[#111827]">
                <CheckCircle2 size={18} className="text-[#90E6A7] fill-[#90E6A7] text-white shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Amenities Icons */}
        <section>
          <h3 className="text-lg md:text-xl font-bold mb-5 text-[#111827]">Amenities</h3>
          <div className="flex flex-wrap gap-3">
            <AmenityTag icon={<Wifi size={16}/>} label="Free WiFi" />
            <AmenityTag icon={<Coffee size={16}/>} label="Breakfast" />
            <AmenityTag icon={<Waves size={16}/>} label="Pool" />
            <AmenityTag icon={<Droplets size={16}/>} label="Water" />
          </div>
        </section>
      </div>

      {/* Room Facilities Full List */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h3 className="text-lg md:text-xl font-bold mb-6 text-[#111827]">Room Facilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-4">
          {["Hot & Cold Water", "Luxury Toilet", "Shower Area", "Mirror & Vanity Area", "Clean Linen & Towels", "Hair Dryer", "Proper Ventilation", "Bedside Switches"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-[13px] md:text-sm font-semibold text-[#111827]">
              <CheckCircle2 size={18} className="text-[#90E6A7] fill-[#90E6A7] text-white shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const AmenityTag = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-3 rounded-xl min-w-[75px] transition-colors cursor-default">
    <div className="text-[#4B5563] mb-1.5">{icon}</div>
    <span className="text-[10px] font-bold text-[#374151] whitespace-nowrap uppercase tracking-tighter">{label}</span>
  </div>
);

export default RoomDetail;