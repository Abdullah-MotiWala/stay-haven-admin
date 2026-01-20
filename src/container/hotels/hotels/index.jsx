import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import MatrixCard from "../../../components/MatrixCard";
import Breadcrumb from "../../../components/Breadcrumb";
import HotelDirectory from "../../../components/Table";
import { getAllHotels, deleteHotel, getStats } from "../../../services/hotel";
import home1 from "../../../assets/icons/home-1.png";
import home2 from "../../../assets//icons/home-2.png";
import home3 from "../../../assets/icons/home-3.png";
import home4 from "../../../assets/icons/home-4.png";
import { openNotification } from "../../../network/notification";

const HotelsListing = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        console.log(res.data, "HOTEL===");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        openNotification("error", "Failed to load stats");
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    console.log("UseEffect Run Times");
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();
        setHotels(res.data || []);
        setRefresh(false);
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this hotel?")) {
      try {
        await deleteHotel(id);
        setHotels(hotels.filter((hotel) => hotel.id !== id));
        openNotification("success", "Hotel deleted successfully");
      } catch (err) {
        console.error("Any Problem in deleteing", err);
        openNotification("error", "Internal Server Error");
      }
    }
  };

  const cardsData = [
    {
      title: "Total Hotels",
      value: stats?.totalHotels,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: "+12%",
      trendText: "vs last week",
      showTrend: true,
    },
    {
      title: "Active Hotels",
      value: stats?.activeHotels,
      bg: "#EFF9FF",
      iconBg: "#C7DAE7",
      image: home2,
    },
    {
      title: "Inactive Hotels",
      value: stats?.inactiveHotels,
      bg: "#F7EFFF",
      iconBg: "#DED0EC",
      image: home3,
    },
    {
      title: "In Draft",
      value: stats?.inDraft,
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

  console.log(hotels,"hotelshotelshotels")
  return (
    <div className="p-0">
      <div className="mt-4 px-3">
        <Breadcrumb title="Hotels" />
      </div>

      <div className="my-12">
        <MatrixCard data={cardsData} />
      </div>

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
            data={hotels?.data}
            onDelete={handleDelete}
            title="Hotels Directory"
            columns={columns}
            setRefresh={setRefresh}
          />
        )}
      </div>
    </div>
  );
};

export default HotelsListing;