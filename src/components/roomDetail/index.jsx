import React, { useEffect } from "react";
import path from "../../assets/icons/Path.png";
import water from "../../assets/icons/water.png";
import pool from "../../assets/icons/pool.png";
import group from "../../assets/icons/group.png";
import gests from "../../assets/icons/gests.png";
import { useState } from "react";
import location from "../../assets/icons/location.svg";
import tick from "../../assets/icons/tick.png";
import wifi from "../../assets/icons/wifi.png";
import { Image } from "antd";
import { DEFAULT_IMAGE } from "../../shared/constant";
import { useNavigate } from "react-router-dom";
import editIcon from "../../assets/icons/editIcon.svg";
import {
  Wifi,
  Utensils,
  Waves,
  ParkingCircle,
  Droplets,
  Coffee,
  Star,
  HelpCircle,
  Shield, 
  HandPlatter
} from "lucide-react";
import Rooms from "../rooms";

function RoomDetail({ room, editPath }) {
 const AMENITY_ICON_BY_NAME = {
   breakfast: Coffee,
   complimentary_breakfast: Coffee,   // 👈 add
   wifi: Wifi,
   free_wifi: Wifi,
   pool: Waves,
   swimming_pool: Waves,              // 👈 add (actual DB key)
   dinner: Utensils,
   parking: ParkingCircle,
   hot_cold_water: Droplets,          // 👈 add (actual DB key)
   hot_cold_water_facility: Droplets, // 👈 ye bhi dekha data mein — ROOM_FACILITY type mein hai
   safety_box:Shield ,
   room_service:HandPlatter,
 };
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

  const THUMBS_PER_PAGE = 4;
  let id = room?.id
  const [mainImage, setMainImage] = useState(null);
  const [visibleThumbs, setVisibleThumbs] = useState(THUMBS_PER_PAGE);
  const navigate = useNavigate();
  const handleEditClick = () => {
    navigate(editPath ? `${editPath}/${id}` : `/admin/rooms/edit/${id}`);
  };

  const galleryPool = [room?.mainImage, ...(room?.galleryImages || [])].filter(
    (img, index, arr) => Boolean(img) && arr.indexOf(img) === index
  );

  useEffect(() => {
    setMainImage(room?.mainImage || room?.galleryImages?.[0] || null);
    setVisibleThumbs(THUMBS_PER_PAGE);
  }, [room]);

  const allImages = galleryPool.map((src) => ({ src }));
  const thumbnails = galleryPool.filter((img) => img !== mainImage);
  const currentImages = thumbnails.slice(0, visibleThumbs);
  const hasMore = thumbnails.length > visibleThumbs;

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleShowMoreImages = () => {
    setVisibleThumbs((prev) => prev + THUMBS_PER_PAGE);
  };

  const getAmenityIcon = (name) => {
    const key = (name ?? "").toLowerCase().trim();
    return AMENITY_ICON_BY_NAME[key] || HelpCircle;
  };
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-[20px] md:rounded-[30px] shadow-sm font-sans overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lightSeconday text-md  font-medium tracking-wider">
          Room Details
        </span>
        <button onClick={handleEditClick} className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-sm font-semibold text-extradark hover:bg-blue hover:text-white transition-all duration-300">
          <img src={editIcon} alt="Edit Icon" className="hover:text-white" />
          Edit
        </button>
      </div>

      <div className="flex flex-col  justify-between items-start md:items-center gap-4 mb-4 w-full min-w-0">

        {/* Left Side: Name and Status (Added min-w-0 aur flex-1) */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl font-semibold text-extradark leading-tight truncate max-w-full">
            {room?.roomName || room?.roomType || room?.type || "N/A"}
          </h1>

          <span className={`text-xs md:text-sm px-2 py-1 rounded-lg font-medium shrink-0 whitespace-nowrap ${STATUS_STYLE[room?.status] || "bg-gray-100 text-gray-600"}`}>
            {formatStatus(room?.status)}
          </span>
        </div>

        {/* Right Side: Price (Added shrink-0 taake ye kabhi chhota na ho) */}
        <div className="flex items-baseline gap-1 shrink-0">
          <span className="text-xl md:text-[24px] font-bold text-[#111827]">
            {room.pricePerNightFormatted ?? 0}
          </span>
          <span className="text-[#7C8DB5] text-xs md:text-lg font-medium">
            /night
          </span>
        </div>
      </div>

      <p className="text-[#7C8DB5] text-[14px] font-medium flex items-center gap-1 mb-6 text-sm md:text-base">
        <span className="text-lg">
          <img src={location} alt="" className="size-3" />
        </span>{" "}
        {room?.hotel?.name ?? "N/A"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <Image.PreviewGroup items={allImages}>
        <div className="lg:col-span-3">
          <Image
            src={mainImage || DEFAULT_IMAGE}
            fallback={DEFAULT_IMAGE}
            alt="Main"
            width="100%"
            height={260}
            style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 24 }}
            preview={{ mask: <span className="text-sm font-medium">View</span> }}
          />
        </div>
        <div className="hidden lg:flex flex-col gap-3">
          {currentImages.map((img, index) => (
            <div key={index} className="relative">
              <Image
                src={img || DEFAULT_IMAGE}
                fallback={DEFAULT_IMAGE}
                alt={`Gallery ${index + 1}`}
                width="100%"
                height={80}
                style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 15 }}
                preview={false}
                onClick={() => handleImageClick(img)}
                className="cursor-pointer"
              />
            </div>
          ))}
          {hasMore && (
            <div
              onClick={handleShowMoreImages}
              className="relative w-full h-16  cursor-pointer rounded-2xl overflow-hidden group "
            >
              <img
                src={DEFAULT_IMAGE}
                className="w-full h-full object-cover"
                alt="More"
              />
              <div className="absolute inset-0 bg-[#A5C9FF]/90  flex items-center justify-center transition-colors group-hover:bg-[#A5C9FF]/100">
                <span className="text-[#1E40AF] font-bold text-sm">
                  +{thumbnails.length - currentImages.length} more
                </span>
              </div>
            </div>
          )}
        </div>
        </Image.PreviewGroup>
      </div>

      <div className="flex flex-wrap  items-center gap-2">
        <span className="flex items-center gap-1  text-[13px] fount-medium  rounded-md text-sm">
          <img src={gests} alt="test" />
          {room.roomSize ?? "N/A"}
        </span>
        <span className="flex items-center gap-1 text-[13px] fount-medium  rounded-md text-sm">
          <img src={gests} alt="" /> {room.bedType ?? "N/A"}
        </span>
        <span className="flex items-center gap-1 text-[13px] fount-medium  rounded-md text-sm">
          <img src={gests} alt="" /> {room.maxAdults ?? "N/A"}
        </span>
      </div>

      <p className="text-[#7C8DB5] leading-relaxed my-4 text-sm md:text-sm break-words">
        {room?.description ?? "N/A"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-3 space-y-10 ">
        <div className="">
          <h3 className="text-lg md:text-lg font-semibold  text-extradark">
            Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {room?.features?.filter((item) => item.type === "ROOM_FEATURE")
              .length > 0 ? (
              room.features
                .filter((item) => item.type === "ROOM_FEATURE")
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-xs md:text-sm font-medium text-extradark overflow-hidden"
                  >
                    <img
                      src={tick}
                      alt=""
                      className="h-5 w-5 bg-lightGreen p-1 rounded-full shrink-0"
                    />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.title}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-lightSecondary font-medium">N/A</p>
            )}
          </div>
        </div>

        <div className="">
          <h3 className="text-lg md:text-lg font-semibold  text-extradark">
            Amenities
          </h3>
          <div className="flex flex-wrap gap-1">
            {room?.features?.filter((item) => item.type === "AMENITY").length >
              0 ? (
              room.features
                .filter((item) => item.type === "AMENITY")
                .map((item, index) => {
                  const Icon = getAmenityIcon(item.key);

                  return (
                    <div
                      key={index}
                      className="p-1 px-4 bg-havenLight rounded-xl flex flex-col items-center justify-center h-15"
                    >
                      {item.icon ? (
                        <img src={item.icon} alt={item.title} className="w-5 h-5 object-contain" />
                      ) : (
                        Icon && <Icon size={16} className="text-lightPurple" />
                      )}
                      <p className="font-medium mb-0 text-[12px] text-center">
                        {item.title}
                      </p>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-lightSecondary font-medium">N/A</p>
            )}
          </div>
        </div>

        <div className="">
          <h3 className="text-lg md:text-xl font-semibold  text-extradark">
            Room Facilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-4">
            {room?.features?.filter((item) => item.type === "ROOM_FACILITY")
              .length > 0 ? (
              room.features
                .filter((item) => item.type === "ROOM_FACILITY")
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm md:text-sm font-medium text-extradark"
                  >
                    <img
                      src={tick}
                      alt=""
                      className="h-5 w-5 bg-lightGreenOne p-1 rounded-full"
                    />
                    {item.title}
                  </div>
                ))
            ) : (
              <p className="text-sm text-seconday font-medium">N/A</p>
            )}
          </div>
        </div>

        <div className="">
          <h3 className="text-lg md:text-xl font-semibold  text-extradark">
            Rules & Policies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-4">
            {room?.features?.filter((item) => item.type === "POLICY")
              .length > 0 ? (
              room.features
                .filter((item) => item.type === "POLICY")
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm md:text-sm font-medium text-extradark"
                  >
                    <img
                      src={tick}
                      alt=""
                      className="h-5 w-5 bg-lightGreenOne p-1 rounded-full"
                    />
                    {item.title}
                  </div>
                ))
            ) : (
              <p className="text-sm text-seconday font-medium">N/A</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const AmenityTag = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-3 rounded-xl min-w-[75px] transition-colors cursor-default">
    <div className="text-[#4B5563] mb-1.5">{icon}</div>
    <span className="text-[10px] font-bold text-[#374151] whitespace-nowrap uppercase tracking-tighter">
      {label}
    </span>
  </div>
);

export default RoomDetail;