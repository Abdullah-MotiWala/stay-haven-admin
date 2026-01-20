// import React from 'react';
// import { Card, Tag, Button } from 'antd';
// import { UserOutlined } from '@ant-design/icons';

// const RoomCard = ({ name, price, image, capacity, description, onViewDetails }) => {
//   return (
//     <Card
//       hoverable
//       cover={<img alt={name} src={image} className="h-56 object-cover" />}
//       className="rounded-xl overflow-hidden shadow-md border-none"
//     >
//       <div className="flex justify-between items-start mb-2">
//         <h3 className="text-lg font-bold text-gray-800">{name}</h3>
//         <Tag color="blue" className="m-0 font-bold px-3">${price}/night</Tag>
//       </div>
//       <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
//       <div className="flex justify-between items-center border-t pt-4">
//         <span className="text-gray-400 text-xs font-medium">
//           <UserOutlined className="mr-1" /> {capacity} Guests
//         </span>
//         <Button 
//           type="primary" 
//           size="small" 
//           onClick={onViewDetails}
//           className="rounded-md font-semibold"
//         >
//           View Details
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default RoomCard;

import React, { useState } from 'react';
import { MoreVertical, SquareArrowOutUpRight, Edit2, Trash2, Maximize, Bed, Users } from 'lucide-react';
import cardImage from "../../assets/images/cardImage.png"
import gests from "../../assets/icons/gests.png"
import location from "../../assets/icons/location.png"
function RoomCard({ room, active, onClick }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl cursor-pointer border transition-all duration-200 shadow-sm
        ${active ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100 hover:border-gray-200"}
      `}
    >
      {/* Room Image */}
      <div className="w-full md:w-60 h-60 shrink-0">
        <img
          src={cardImage}
          alt={room.title}
          className="w-full h-full object-cover rounded-[15px]"
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 justify-between  py-1">
        <div>
          {/* Header: Room No & Status */}
          <div className="flex justify-between items-center items-start mb-0">
            <span className="text-[14px] font-medium text-gray-800">
              {room.roomNo}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] bg-[#90E6A7] text-[#1A4D2E] px-2 py-1 rounded-lg  font-medium">
                {room.status}
              </span>
              
              {/* Three Dots Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical className="w-6 h-6 text-gray-600" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-2">
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><SquareArrowOutUpRight size={16}/> View</button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"><Edit2 size={16}/> Edit</button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={16}/> Delete</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title & Location */}
          <h2 className="text-[24px] font-semibold text-gray-900 leading-tight mb-2">
            {room.title}
          </h2>
          
          <div className="flex items-center gap-2 text-[#7C8DB5] font-medium mb-3">
            <span className="flex items-center font-medium text-[14px] gap-1 border-r-2 border-gray-100"><img src={location} alt="" /> {room.view}</span>
  
            <div className="flex items-center gap-2">
               <span className="flex items-center gap-1  text-[13px] fount-medium  rounded-md text-sm"><img src={gests} alt="" />{room.size}</span>
               <span className="flex items-center gap-1 text-[13px] fount-medium  rounded-md text-sm"><img src={gests} alt="" /> {room.bed}</span>
               <span className="flex items-center gap-1 text-[13px] fount-medium  rounded-md text-sm"><img src={gests} alt="" /> {room.guests}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#1F2937] text-[14px] font-medium leading-relaxed mb-0">
            {room.description}
          </p>
        </div>

        {/* Footer: Guest & Price */}
        <div className="flex justify-between items-end mt-0">
          <div className="text-[#7C8DB5] font-md text-lg">
            Guest: <span className="text-[#7C8DB5]">N/A</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-bold text-gray-900">${room.price}</span>
            <span className="text-[#7C8DB5] text-xl font-medium">/night</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;

