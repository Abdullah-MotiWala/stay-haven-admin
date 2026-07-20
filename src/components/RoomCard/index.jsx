﻿import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import checkList from "../../assets/icons/checkList.svg";
import location from "../../assets/icons/location.svg";
import { DEFAULT_IMAGE } from "../../shared/constant";
import { useNavigate } from "react-router-dom";
import { Modal, Image } from "antd";
import { deleteRoom } from "../../services/rooms";
import { openNotification } from "../../network/notification";

function RoomCard({ room, active, onClick, onStatusChange, editPath, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const STATUS_OPTIONS = ["available", "active", "occupied", "maintenance", "inactive"];
  const STATUS_STYLE = {
    available: "bg-lightGreenOne text-darkGreen",
    active: "bg-lightGreenOne text-darkGreen",
    occupied: "bg-lightYellow text-black",
    booked: "bg-lightYellow text-black",
    maintenance: "bg-orange-100 text-orange-600",
    inactive: "bg-lightRed text-red",
    draft: "bg-gray-100 text-gray-600",
    pending_approval: "bg-orange-100 text-orange-600",
  };
  const formatStatus = (value) =>
    value ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "N/A";
  let id = room?.id;
  const handleEditClick = () => { navigate(editPath ? `${editPath}/${id}` : `/admin/rooms/edit/${id}`); };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);

    // ✅ Occupied check — API call se pehle hi rok do
    if (room?.status === "occupied" || room?.status === "booked") {
      Modal.error({
        title: "Cannot Delete Room",
        icon: null,
        content: (
          <div className="py-2">
            <p className="text-gray-600 text-sm">
              This room cannot be deleted because it is currently{" "}
              <span className="font-semibold text-red-600">Occupied</span>.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Please wait until the guest checks out or change the room status before deleting.
            </p>
          </div>
        ),
        okText: "Okay",
        okButtonProps: {
          style: {
            backgroundColor: "#DC2626",
            borderColor: "#DC2626",
            color: "#fff",
          },
        },
      });
      return; // 🔴 yahan se bahar — delete nahi hoga
    }

    // Normal delete flow (occupied nahi hai toh)
    Modal.confirm({
      title: "Delete Room",
      icon: null,
      content: "Are you sure you want to delete this room?",
      okText: "Delete",
      okButtonProps: {
        style: { backgroundColor: "#8B0000", borderColor: "#8B0000", color: "#fff" },
      },
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await deleteRoom(id);
          if (res?.data?.success === false) {
            const { message, dependencies } = res.data;
            if (dependencies?.length) {
              Modal.error({
                title: "Cannot Delete",
                icon: null,
                content: (
                  <div>
                    <p className="text-gray-600 mb-3">{message}</p>
                    <div className="space-y-2">
                      {dependencies.map((dep, i) => (
                        <div key={i} className="py-2 px-3 bg-gray-50 rounded-lg text-sm">
                          <p className="text-gray-800 font-semibold">{dep.name}</p>
                          {dep.detail && (
                            <p className="text-gray-500 text-xs mt-0.5">{dep.detail}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ),
                okText: "OK",
                okButtonProps: { className: "bg-mainPrimary" },
              });
            } else {
              Modal.error({
                title: "Cannot Delete",
                icon: null,
                content: (
                  <p className="text-gray-600">
                    {message || "Cannot delete. It may have active bookings."}
                  </p>
                ),
                okText: "OK",
                okButtonProps: { className: "bg-mainPrimary" },
              });
            }
            return;
          }
          openNotification("success", "Deleted successfully");
          onDelete && onDelete(id);
        } catch (err) {
          openNotification("error", err?.response?.data?.message || "Failed to delete");
        }
      },
    });
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col md:flex-row gap-4 bg-white p-2 rounded-xl cursor-pointer border transition-all duration-200 shadow-sm
        ${active ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100 hover:border-gray-200"}
      `}
    >
      <div className="w-full md:w-60 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Image
          src={room.mainImage || DEFAULT_IMAGE}
          fallback={DEFAULT_IMAGE}
          alt={room?.roomName || room?.roomType?.title || "Room"}
          width="100%"
          height={176}
          style={{ width: "100%", height: 176, objectFit: "cover", borderRadius: 8 }}
          preview={{ mask: <span className="text-xs font-medium">View</span> }}
        />
      </div>

      <div className="flex flex-col flex-1  min-w-0">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2 min-w-0">

            {/* Left Side: Room Number & Title (min-w-0 aur flex-1 zaroori hai) */}
            <div className="min-w-0 flex-1">
              <span className="text-[14px] font-medium text-gray-800 block">
                Room No: {room.roomNumber ?? 0}
              </span>
              <h3 className="truncate text-lg font-semibold text-gray-800" title={room?.roomName || room?.roomType?.title || room?.type}>
                {room?.roomName || room?.roomType?.title || room?.type || "N/A"}
              </h3>
            </div>

            {/* Right Side: Status & Menu (shrink-0 zaroori hai taake ye title ko push na kare) */}
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-sm ${STATUS_STYLE[room.status] || "bg-gray-100 text-gray-600"} px-2 py-1 rounded-lg font-medium whitespace-nowrap`}>
                {formatStatus(room.status)}
              </span>

              {/* Three Dots Menu */}
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-6 h-6 text-gray-600" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-lightSeconday rounded-xl z-10 py-2 px-2">
                    <button className="flex items-center gap-3 w-full py-2 text-sm text-black font-semibold px-2" onClick={handleEditClick}>Edit</button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-3 w-full py-2 text-sm text-red-600 font-semibold px-2 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
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
          <p className="text-[#1F2937] text-[14px] font-medium leading-relaxed mb-0 line-clamp-2 break-words">
            {room?.description ?? "N/A"}
          </p>
        </div>

        <div className="flex justify-between items-end mt-0">
          <div className="text-[#7C8DB5] font-medium text-[14px]">
            Host: <span className="text-[#7C8DB5]">{room?.host?.name ?? "N/A"}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[24px] font-bold text-gray-900">
               {room?.pricePerNightFormatted ?? 0}
            </span>
            <span className="text-[#7C8DB5] text-xl font-medium">/night</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;