import React, { useEffect, useState } from "react";
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
import { openNotification } from "../../../network/notification";

const HotelsListing = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();

        setHotels(res.data || []);
      } catch (err) {
        console.error("Data fetch karne mein masla:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this hotel?")) {
      try {
        await deleteHotel(id);

        setHotels(hotels.filter((hotel) => hotel.id !== id));
        // alert("Hotel deleted");
        openNotification("success", "Hotel deleted successfully");
      } catch (err) {
        console.error("Any Problem in deleteing", err);
        // alert("Can not be deleted.");
        openNotification("error", "Internal Server Error");
      }
    }
  };
  const cardsData = [
    {
      title: "Total Hotels",
      value: 24,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: "+12%",
      trendText: "vs last week",
      showTrend: true,
    },
    {
      title: "Active Hotels",
      value: 14,
      bg: "#EFF9FF",
      iconBg: "#C7DAE7",
      image: home2,
    },
    {
      title: "Inactive Hotels",
      value: 8,
      bg: "#F7EFFF",
      iconBg: "#DED0EC",
      image: home3,
    },
    {
      title: "In Draft",
      value: 2,
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
