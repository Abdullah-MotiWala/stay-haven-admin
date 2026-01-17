import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // useNavigate add kiya
import { getHotelById } from "../../../services/hotel";
import MatrixCard from "../../../components/MatrixCard";
import { ShopOutlined } from "@ant-design/icons";
import RoomOccupancyCard from "../../../components/RoomOccupation";
import Breadcrumb from "../../../components/Breadcrumb";
import BookingTable from "../../../components/RecentTable";
import editIcon from "../../../assets/icons/editIcon.png";
import downArrowIcon from "../../../assets/icons/downArrowIcon.png";
import { DEFAULT_IMAGE } from "../../../shared/constant";
import hotel1 from "../../../assets/icons/IconHotel1.png";
import hotel2 from "../../../assets//icons/IconHotel1.png";
import hotel3 from "../../../assets/icons/IconHotel2.png";
import hotel4 from "../../../assets/icons/IconHotel3.png";
import HotelDirectory from "../../../components/Table";
import RevenueSnapshot from "../../../components/hotels/charts";
import { getAllFeature } from "../../../services/features";
import {
  Wifi,
  Utensils,
  Waves,
  ParkingCircle,
  Droplets,
  Coffee,
  Star,
  HelpCircle
} from "lucide-react";

  const AMENITY_ICONS = {
    wifi: Wifi,
    breakfast: Coffee,
    dinner: Utensils,
    pool: Waves,
    parking: ParkingCircle,
    coldandwarm: Droplets,
  };

const HotelProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const uiHotelId = location.state?.uiHotelId;

  console.log(uiHotelId, "uiHotelIduiHotelId");
  console.log("location.state =", location.state);


  useEffect(() => {

    const fetchFeatures = async () => {
      // setFetching(true);
      try {
        const res = await getAllFeature("AMENITY");
        const features = res.data;

        setAmenitiesList(features);
      } catch (err) {
        console.error("Failed to load hotel:", err);
        alert("Hotel load nahi ho saka");
      } finally {
        // setFetching(false);
      }
    };

    fetchFeatures();
  }, []);

  console.log(amenitiesList, "amenitiesListamenitiesList");
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const res = await getHotelById(id);
        console.log(res, "resresres");
        setHotel(res.data);
      } catch (err) {
        console.error("Hotel detail fetch karne mein error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHotelData();
  }, [id]);

  const handleEditClick = () => {
    navigate(`/admin/hotel/edit/${id}`);
  };

  const cardsData = [
    {
      title: "Total Rooms",
      value: 120,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: hotel1,
      // trend: "+12%",
      // trendText: "vs last week",
      showTrend: false,
    },
    {
      title: "Occupied",
      value: 84,
      bg: "#EFF9FF",
      iconBg: "#C7DAE7",
      image: hotel1,
    },
    {
      title: "Available Rooms",
      value: 34,
      bg: "#F7EFFF",
      iconBg: "#DED0EC",
      image: hotel3,
    },
    {
      title: "In Draft",
      value: "02",
      bg: "#F3F4FB",
      iconBg: "#CBCEE7",
      image: hotel4,
    },
  ];



  if (loading)
    return (
      <div className="p-20 text-center text-blue-600 font-bold text-xl tracking-wider animate-pulse">
        Loading Hotel Profile...
      </div>
    );
  if (!hotel)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        Hotel Not Found!
      </div>
    );

  const columns = [
    { key: "bookingId", label: "Booking ID", type: "text" },
    { key: "guestName", label: "Guest Name", type: "text" },
    { key: "roomType", label: "Room Type", type: "roomType" },
    { key: "roomNumber", label: "Room No", type: "text" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "checkInOut", label: "Check-In & Check-Out", type: "dateRange" },
    { key: "status", label: "Status", type: "status" },
  ];

  const bookings = [
    {
      bookingId: "#321-02",
      guestName: "Muhammad Akbar Ali Khan Iqbal",
      roomType: "Deluxe",
      roomNumber: "Room 101",
      duration: "3 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-In",
    },
    {
      bookingId: "#321-02",
      guestName: "Sara Iqbal",
      roomType: "Standard",
      roomNumber: "Room 202",
      duration: "2 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-In",
    },
    {
      bookingId: "#321-02",
      guestName: "Alexander James William Robert Smith",
      roomType: "Deluxe",
      roomNumber: "Room 300",
      duration: "1 night",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-Out",
    },
    {
      bookingId: "#321-02",
      guestName: "Sophia Grace",
      roomType: "Deluxe",
      roomNumber: "Room 119",
      duration: "3 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-Out",
    },
    {
      bookingId: "#321-02",
      guestName: "Benjamin Thomas Edward Samuel Brown",
      roomType: "Standard",
      roomNumber: "Room 210",
      duration: "2 nights",
      checkIn: "Jan 02, 2026",
      checkOut: "Jan 05, 2026",
      status: "Checked-In",
    },
  ];
const AMENITY_ICON_BY_NAME = {
  "break fast": Coffee,
  "breakfast": Coffee,
  "wifi": Wifi,
  "pool": Waves,
  "dinner": Utensils,
  "parking": ParkingCircle,
  "cold / warm water": Droplets,
};


  const getAmenityIcon = (name = "") => {
  const key = name.toLowerCase().trim();
  return AMENITY_ICON_BY_NAME[key] || HelpCircle;
};

  console.log(hotel.amenities, "asdsadsad12313");
  return (
    <>
      <div className="mt-4  !overflow-x-hidden">
        <Breadcrumb title="Hotels" subtitle="View hotel" />
      </div>


      <div className="w-full overflow-x-hidden bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-bold text-[#1B2559]">
            Hotel Profile
          </h3>

          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-sm font-semibold text-extradark hover:text-extradark transition-all duration-300"
          >
            <img src={editIcon} alt="Edit Icon" />
            Edit
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
          <div className="w-full lg:w-[217px] h-[152px] shrink-0">
            <img
              src={hotel.img ?? DEFAULT_IMAGE}
              className="w-full h-full rounded-[16px] object-cover border border-gray-100"
              alt={hotel.name}
            />
          </div>

          <div className="flex-1 flex flex-col lg:flex-row items-start gap-8">
            <div className="w-full max-w-[320px] shrink-0">
              <h1 className="text-[28px] font-medium text-[#1B2559] leading-tight">
                {hotel.name}
              </h1>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-[#8B95B7]">
                  {hotel.city}, {hotel.country}
                </span>

                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <span className="bg-[#DBE9FF] text-[#0A5BE2] px-3 py-2 rounded-full text-xs font-semibold uppercase">
                  #{uiHotelId ?? "N/A"}
                </span>

                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    hotel.isActive
                      ? "bg-[#A5E3B8] text-[#2D6A4F]"
                      : "bg-[#FECACA] text-[#B91C1C]"
                  }`}
                >
                  {hotel.isActive ? "Active" : "Inactive"}
                  <img src={downArrowIcon} alt="arrow" />
                </div>
              </div>
            </div>

            <span className="hidden lg:block self-stretch w-px bg-lightSeconday" />

            <div className="flex flex-1 flex-col sm:flex-row gap-6 xl:gap-10">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-1">
                    Hotel Address
                  </p>
                  <p className="text-[13px] font-medium text-[#1B2559]">
                    {hotel.address}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-1">
                    Cancellation Policy
                  </p>
                  <p className="text-[13px] font-medium text-[#1B2559]">
                    {hotel.cancellation_policy || "No Policy Set"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-1">
                    Contact Email
                  </p>
                  <p className="text-[13px] font-medium text-[#1B2559]">
                    {hotel.email || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-normal tracking-wider text-[#8B95B7] mb-2">
                    Amenities included
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {hotel?.amenities?.map((item) => {
                      // const Icon = AMENITY_ICONS[item.name];
                      const Icon = getAmenityIcon(item.name);
                      
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-lightPurple bg-lightColor"
                        >
                          {Icon && <Icon size={16} className="text-lightPurple" />}
                          {item.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MatrixCard showShadow={false} icon={ShopOutlined} data={cardsData} />
      </div>

      <div
        className="grid mt-6 gap-6"
        style={{ gridTemplateColumns: "40% 59%" }}
      >
        <RoomOccupancyCard
          data={[
            { label: "One Bed Rooms", used: 18, total: 25 },
            { label: "Two Bed Rooms", used: 32, total: 45 },
            { label: "Three Bed Rooms", used: 14, total: 20 },
            { label: "Luxury Suites", used: 8, total: 10 },
          ]}
        />

        <RevenueSnapshot />
      </div>

      <div className="min-h-[400px] mt-6 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <HotelDirectory
          data={bookings}
          title="Recent Bookings"
          columns={columns}
          filter={false}
          view={true}
        />
      </div>
    </>
  );
};

export default HotelProfile;
