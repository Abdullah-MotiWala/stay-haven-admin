import React, { useEffect } from "react";

import gests from "../../../assets/icons/gests.png";
import { useState } from "react";
import location from "../../../assets/icons/location.svg";
import tick from "../../../assets/icons/tick.png";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import { useNavigate } from "react-router-dom";
import editIcon from "../../../assets/icons/editIcon.svg";
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

function AppartmentDetail({ data }) {
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

const [mainImage, setMainImage] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMainImage(data.mainImage);
    if (data?.galleryImages?.length > 0) {
      setCurrentImages(data.galleryImages.slice(0, 4)); 
      setHasMore(data.galleryImages.length > 4);
    } else {
      setMainImage(null);
      setCurrentImages([]);
      setHasMore(false);
    }
  }, [data]); 

  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handleShowMoreImages = () => {
    const nextImages = data?.galleryImages?.slice(
      currentImages.length,
      currentImages.length + 4
    );
    setCurrentImages((prevImages) => [...prevImages, ...nextImages]);
    setHasMore(data?.galleryImages?.length > currentImages.length + 4);
  };

  const getAmenityIcon = (name = "") => {
    const key = (name ?? "").toLowerCase().trim();
    return AMENITY_ICON_BY_NAME[key] || HelpCircle;
  };
  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-[20px] md:rounded-[30px] shadow-sm font-sans overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lightSeconday text-md  font-medium tracking-wider">
          Appartment Details
        </span>
        <button onClick={()=>navigate("/admin/appartment/edit/" + data.id)} className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-sm font-semibold text-extradark hover:text-extradark hover:!bg-maxLightRed transition-all duration-300">
          <img src={editIcon} alt="Edit Icon" />
          Edit
        </button>
      </div>

      <div className="flex flex-col  md:justify-between md:items-center gap-2 mb-4">
        <div className="flex justify-center    items-center gap-2 md:gap-4">
          <h1 className="text-2xl md:text-md font-semibold text-extradark leading-tight">
            {data?.apartmentName || data?.type || "N/A"}
          </h1>
          <span
            className={`text-sm  ${data?.status === "available" ? "bg-lightGreenOne text-darkGreen" : "bg-lightYellow text-black"}  px-2 py-1 rounded-lg  font-medium`}
          >
            {data?.status
              ? data?.status.charAt(0).toUpperCase() + data?.status.slice(1)
              : "N/A"}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl md:text-[24px] font-bold text-[#111827]">
            {data.pricePerNightFormatted ?? 0}
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
        {data?.hotel?.name ?? "N/A"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="lg:col-span-3">
          <img
            src={mainImage ?? DEFAULT_IMAGE}
            alt="Main"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
        <div className="hidden lg:flex flex-col gap-3 cursor-pointer">
          {currentImages.map((img, index) => (
            <img
              src={img ?? DEFAULT_IMAGE}
              alt={`Gallery Image ${index}`}
              className="w-full h-20 object-cover rounded-[15px]"
            
              onClick={() => handleImageClick(img)}
            />
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
                  +{data.galleryImages.length - currentImages.length} more
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1  text-[13px] fount-medium  rounded-md text-sm">
          <img src={gests} alt="test" />
          {data.apartmentSize ?? "N/A"}
        </span>
        <span className="flex items-center gap-1 text-[13px] fount-medium  rounded-md text-sm">
          <img src={gests} alt="" /> {data.bedType ?? "N/A"}
        </span>
        <span className="flex whitespace-nowrap overflow-hidden text-ellipsis items-center gap-1 text-[13px] fount-medium  rounded-md text-sm">
          <img src={gests} alt="" /> {data.maxAdults ?? "N/A"}
        </span>
      </div>
{/* 
      <p className="text-lightSeconday   leading-relaxed my-4 text-sm md:text-sm">
        {data?.description ?? "N/A"}
      </p> */}
      <p className="text-[#7C8DB5] leading-relaxed my-4 text-sm md:text-sm break-words">
        {data?.description ?? "N/A"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-3 space-y-10 ">
        <div className="">
          <h3 className="text-lg md:text-lg font-semibold  text-extradark">
            Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
            {data?.features?.filter((item) => item.type === "ROOM_FEATURE")
              .length > 0 ? (
              data.features
                .filter((item) => item.type === "ROOM_FEATURE")
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-xs md:text-sm font-medium text-extradark overflow-hidden"
                    >
                    <img
                      src={tick}
                      alt=""
                      className="h-5 w-5 bg-lightGreen p-1 rounded-full"
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
            {data?.features?.filter((item) => item.type === "AMENITY").length >
            0 ? (
              data.features
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
            Apartment Facilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-4">
            {data?.features?.filter((item) => item.type === "ROOM_FACILITY")
              .length > 0 ? (
              data.features
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

export default AppartmentDetail;
