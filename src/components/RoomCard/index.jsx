import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import checkList from "../../assets/icons/checkList.svg";
import location from "../../assets/icons/location.svg";
import { DEFAULT_IMAGE } from "../../shared/constant";
import { useNavigate } from "react-router-dom";

function RoomCard({ room, active, onClick, onStatusChange, editPath }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const STATUS_OPTIONS = ["available", "active", "occupied", "maintenance", "inactive"];
  let id = room?.id;
  const handleEditClick = () => { navigate(editPath ? `${editPath}/${id}` : `/admin/rooms/edit/${id}`); };

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl cursor-pointer border transition-all duration-200 shadow-sm
        ${active ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100 hover:border-gray-200"}
      `}
    >
      <div className="w-full md:w-60 h-50 shrink-0">
        <img
          src={room.mainImage ?? DEFAULT_IMAGE}
          alt={room.title}
          className="object-cover rounded-lg h-44 w-60"
        />
      </div>

      <div className="flex flex-col flex-1 ">
        <div>
          <div className="flex justify-between  items-start mb-0">
            <div>
              <span className="text-[14px] font-medium text-gray-800">
                Room No: {room.roomNumber ?? 0}
              </span>
              <h3>{room.type}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm  ${room.status === "available" ? "bg-lightGreenOne text-darkGreen" : "bg-lightYellow text-black"}  px-2 py-1 rounded-lg  font-medium`}
              >
                {/* {room.status ?? 0} */}
                {room.status
                  ? room.status.charAt(0).toUpperCase() + room.status.slice(1)
                  : "N/A"}
              </span>

              {/* Three Dots Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreVertical className="w-6 h-6 text-gray-600" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-lightSeconday rounded-xl z-10 py-2 px-2">
                    <button className="flex items-center gap-3 w-full py-2 text-sm text-black font-semibold px-2" onClick={handleEditClick}>Edit</button>
                    <div className="border-t border-gray-100 my-1" />
                    <p className="text-xs text-gray-400 px-2 mb-1">Change Status</p>
                    {STATUS_OPTIONS.map(opt => (
                      <button key={opt} onClick={(e) => { e.stopPropagation(); setShowMenu(false); onStatusChange && onStatusChange(id, opt); }}
                        className={`w-full text-left px-2 py-1.5 text-xs capitalize rounded hover:bg-gray-50 ${room.status === opt ? "font-bold text-blue" : "text-gray-700"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[#7C8DB5] font-medium mb-3">
            <span className="flex items-center gap-1 text-[13px] font-medium w-[48%] md:w-auto">
              <img src={location} alt="" /> {room?.hotel?.name ?? "N/A"}
            </span>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="flex items-center gap-1 text-[13px] font-medium w-[48%] md:w-auto">                <img src={checkList} alt="test" />
                {room.roomSize ?? "N/A"}
              </span>
              <span className="flex items-center gap-1 text-[13px] font-medium w-[48%] md:w-auto">                <img src={checkList} alt="" /> {room.bedType ?? "N/A"}
              </span>
              <span className="flex items-center gap-1 text-[13px] font-medium w-[48%] md:w-auto">                <img src={checkList} alt="" /> {room.maxAdults ?? "N/A"}
              </span>
            </div>
          </div>
          {/* Description */}
          <p className="text-[#1F2937] text-[14px] font-medium leading-relaxed mb-0">
            {room?.hotel?.description ?? "N/A"}
          </p>
        </div>

        <div className="flex justify-between items-end mt-0">
          <div className="text-[#7C8DB5] font-medium text-[14px]">
            Guest: <span className="text-[#7C8DB5]">N/A</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-gray-900">
              ${room?.pricePerNight ?? 0}
            </span>
            <span className="text-[#7C8DB5] text-xl font-medium">/night</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;
