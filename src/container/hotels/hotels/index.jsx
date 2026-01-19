import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import MatrixCard from "../../../components/MatrixCard";
import Breadcrumb from "../../../components/Breadcrumb";
import HotelDirectory from "../../../components/Table"; // Ensure path is correct
import { getAllHotels, deleteHotel } from "../../../services/hotel";
import home1 from "../../../assets/icons/home-1.png";
import home2 from "../../../assets//icons/home-2.png";
import home3 from "../../../assets/icons/home-3.png";
import home4 from "../../../assets/icons/home-4.png";
import dayjs from 'dayjs'

const HotelsListing = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const stats = useMemo(() => {
    // Current Dates setup
    const now = dayjs();
    const startOfCurrentWeek = now.startOf('week');
    const startOfLastWeek = now.subtract(1, 'week').startOf('week');
    const endOfLastWeek = now.subtract(1, 'week').endOf('week');

    let currentWeekCount = 0;
    let lastWeekCount = 0;
    
    let active = 0;
    let inactive = 0;
    let draft = 0;

    hotels.forEach(hotel => {
        const createdDate = dayjs(hotel.createdAt);

        // 1. Basic Stats Logic
        if (hotel.isDeleted) {
            draft++;
        } else if (hotel.isActive) {
            active++;
        } else {
            inactive++;
        }

        // 2. Growth Logic (Percentage ke liye counts)
        if (createdDate.isAfter(startOfCurrentWeek)) {
            currentWeekCount++;
        } else if (createdDate.isAfter(startOfLastWeek) && createdDate.isBefore(endOfLastWeek)) {
            lastWeekCount++;
        }
    });

    // 3. Percentage Calculation Logic
    let percentageString = "0%";
    if (lastWeekCount === 0) {
        percentageString = currentWeekCount > 0 ? `+100%` : "0%";
    } else {
        const diff = ((currentWeekCount - lastWeekCount) / lastWeekCount) * 100;
        const sign = diff >= 0 ? "+" : "";
        percentageString = `${sign}${diff.toFixed(0)}%`; // String format like +12%
    }

    return {
        totalHotels: hotels.length,
        activeHotels: active,
        inactiveHotels: inactive,
        draftHotels: draft,
        growth: percentageString
    };
}, [hotels]);
const { totalHotels, activeHotels, inactiveHotels, draftHotels, growth } = stats;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();
        console.log("fetch hotels ", res)
        setHotels(res.data || []);
      } catch (err) {
        console.error("Data fetch karne mein masla:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(totalHotels, activeHotels, inactiveHotels, draftHotels);
  // Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this hotel?")) {
      try {
        await deleteHotel(id);

        setHotels(hotels.filter((hotel) => hotel.id !== id));
        alert("Hotel deleted");
      } catch (err) {
        console.error("Any Problem in deleteing", err);
        alert("Can not be deleted.");
      }
    }
  };
  const cardsData = [
    {
      title: "Total Hotels",
      value: totalHotels,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: `${growth}`,
      trendText: "vs last week",
      showTrend: true,
    },
    {
      title: "Active Hotels",
      value: activeHotels,
      bg: "#EFF9FF",
      iconBg: "#C7DAE7",
      image: home2,
    },
    {
      title: "Inactive Hotels",
      value: inactiveHotels,
      bg: "#F7EFFF",
      iconBg: "#DED0EC",
      image: home3,
    },
    {
      title: "In Draft",
      value: draftHotels,
      bg: "#F3F4FB",
      iconBg: "#CBCEE7",
      image: home4,
    },
  ];
  const columns = [
    { key: "uiHotelId", label: "Hotel ID", type: "text" },
    { key: "name", label: "Hotel Name", type: "hotel" },
    { key: "totalRooms", label: "Total Rooms", type: "number" },
    { key: "availableRooms", label: "Rooms Available", type: "number" },
    { key: "occupiedRooms", label: "Rooms Occupied", type: "computed" },
    { key: "reserved", label: "Reserved", type: "fallback" },
    { key: "status", label: "Status", type: "status" },
    { key: "actions", label: "Actions", type: "actions" },
  ];

  return (
    <div className="p-0">
      {/* <Navbar /> */}

      <div className="mt-4 px-3">
        <Breadcrumb title="Hotels" />
      </div>

      <div className="my-12">
        <MatrixCard data={cardsData} />
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm mt-12">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600 font-medium">
              Loading Hotels...
            </span>
          </div>
        ) : (
          <HotelDirectory
            data={hotels}
            onDelete={handleDelete}
            title="Hotels Directory"
            columns={columns}
          />
        )}
      </div>
    </div>
  );
};

export default HotelsListing;
