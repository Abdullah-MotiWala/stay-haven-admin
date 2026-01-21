import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import MatrixCard from "../../../components/MatrixCard";
import Breadcrumb from "../../../components/Breadcrumb";
import HotelDirectory from "../../../components/Table";
import {
  getAllHotels,
  deleteHotel,
  getStats,
  lastHotelId,
} from "../../../services/hotel";
import home1 from "../../../assets/icons/home-1.png";
import home2 from "../../../assets//icons/home-2.png";
import home3 from "../../../assets/icons/home-3.png";
import home4 from "../../../assets/icons/home-4.png";
import { openNotification } from "../../../network/notification";
import { Pagination, Select } from "antd";
const entriesPerPageOptions = [10, 20, 30, 40];
const HotelsListing = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

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
    const fetchLastId = async () => {
      try {
        const res = await lastHotelId();
        console.log(res?.data, "lastID===");
        setLastId(res?.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
        openNotification("error", "Failed to load stats");
      }
    };
    fetchLastId();
  }, []);

  useEffect(() => {
    console.log("UseEffect Run Times");
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels(currentPage, itemsPerPage);
        setHotels(res.data || []);
        setRefresh(false);
      } catch (err) {
        console.error("Data fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh, currentPage, itemsPerPage]);

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
    { key: "roomsAvailable", label: "Rooms Available", type: "number" },
    { key: "roomsOccupied", label: "Rooms Occupied", type: "number" },
    { key: "reserved", label: "Reserved", type: "number" },
    { key: "status", label: "Status", type: "status" },
    { key: "actions", label: "Actions", type: "actions" },
  ];

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page); // Update current page state
    setItemsPerPage(pageSize); // Update items per page if needed
  };

  console.log(lastId, "hot213123elshotelshotels");
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
            lastId={lastId?.nextNumericId}
          />
        )}

        <div className="mt-4 flex justify-between">
          <div>
            <Select
              defaultValue={10}
              // style={{ paddingLeft: 10, paddingRight: 10, }}
              className="text-black "
              onChange={(value) => setItemsPerPage(value)}
              options={entriesPerPageOptions.map((option) => ({
                label: option,
                value: option,
              }))}
            />
            <span className="text-lightSeconday ml-4">Entries per page</span>
          </div>
          <Pagination
            current={currentPage} 
            total={stats?.totalHotels || 0}
            pageSize={itemsPerPage} 
            onChange={onPageChange} 
            // showSizeChanger={false} 
            className="flex justify-end "
            // style={{ paddingTop: "20px", paddingBottom: "20px" }} // Adds padding for better spacing
          />
        </div>
      </div>
      {/* Pagination Component */}
    </div>
  );
};

export default HotelsListing;
