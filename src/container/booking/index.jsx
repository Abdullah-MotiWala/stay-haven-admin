import Breadcrumb from "../../components/Breadcrumb";
import MatrixCard from "../../components/MatrixCard";
import home1 from "../../assets/icons/home-1.png";
import home2 from "../../assets//icons/home-2.png";
import home3 from "../../assets/icons/home-3.png";
import home4 from "../../assets/icons/home-4.png";
import HotelDirectory from "../../components/Table";
import { getAllBooking, deleteBooking, getStats } from "../../services/booking";
import { useState, useEffect, useMemo } from "react";
import { openNotification } from "../../network/notification";
import { Pagination, Select } from "antd";
import { useLocation } from "react-router-dom";

const entriesPerPageOptions = [10, 20, 30, 40];

const Booking = () => {
  const location = useLocation();
  const [activeType, setActiveType] = useState("Room Bookings");
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const roomTypes = ["Room Bookings", "Apartment Bookings"];

  const roomColumns = [
    { key: "bookingId",   label: "Booking ID",            type: "text" },
    { key: "guestName",   label: "Guest Name",            type: "text" },
    { key: "roomType",    label: "Room Type",             type: "roomType" },
    { key: "roomNumber",  label: "Room Number",           type: "text" },
    { key: "duration",    label: "Duration",              type: "text" },
    { key: "checkInOut",  label: "Check-In & Check-Out",  type: "dateRange" },
    { key: "status",      label: "Status",                type: "status" },
    { key: "action",      label: "Action",                type: "actions" },
  ];

  const apartmentColumns = [
    { key: "bookingId",       label: "Booking ID",            type: "text" },
    { key: "guestName",       label: "Guest Name",            type: "text" },
    { key: "apartmentName",   label: "Apartment Name",        type: "text" },
    { key: "apartmentNumber", label: "Apartment Number",      type: "text" },
    { key: "hotelName",       label: "Hotel Name",            type: "text" },
    { key: "duration",        label: "Duration",              type: "text" },
    { key: "checkInOut",      label: "Check-In & Check-Out",  type: "dateRange" },
    { key: "status",          label: "Status",                type: "status" },
    { key: "action",          label: "Action",                type: "actions" },
  ];

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res?.data?.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBooking(currentPage, itemsPerPage);
      setRecentBookings(res.data?.data || []);
      setTotal(res.data?.meta?.totalItems || res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      openNotification("error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // ── Refetch jab bhi page pe wapas aao (location change se trigger) ──
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, itemsPerPage, location.key]); // ← location.key add kiya

  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this booking?")) {
      try {
        await deleteBooking(id);
        openNotification("success", "Booking deleted successfully");
        fetchBookings(); // immediately refetch
      } catch (err) {
        openNotification("error", "Internal Server Error");
      }
    }
  };

  const filteredBookings = useMemo(() => {
    if (activeType === "Apartment Bookings")
      return recentBookings.filter((b) => b.isApartment === true);
    if (activeType === "Room Bookings")
      return recentBookings.filter((b) => !b.isApartment);
    return recentBookings;
  }, [activeType, recentBookings]);

  const currentColumns = activeType === "Apartment Bookings" ? apartmentColumns : roomColumns;

  const cardsData = [
    { title: "Total Bookings",      value: stats?.totalBookings    ?? "—", bg: "#F3F7EE", iconBg: "#D1E1BC", image: home1, showTrend: false },
    { title: "Today's Check-ins",   value: stats?.todayCheckIns    ?? "—", bg: "#EFF9FF", iconBg: "#C7DAE7", image: home2 },
    { title: "Today's Check-outs",  value: stats?.todayCheckOuts   ?? "—", bg: "#F7EFFF", iconBg: "#DED0EC", image: home3 },
    { title: "Cancelled Booking",   value: stats?.cancelledBookings ?? "—", bg: "#F3F4FB", iconBg: "#CBCEE7", image: home4 },
  ];

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  return (
    <>
      <Breadcrumb title="Booking" />
      <MatrixCard data={cardsData} />

      <div className="p-0 ml-3 gap-[2px] inline-flex overflow-hidden rounded-lg">
        {roomTypes.map((type) => (
          <button
            key={type}
            onClick={() => { setActiveType(type); setCurrentPage(1); }}
            className={`px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 rounded-0 m-0 ${
              activeType === type ? "bg-blue text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="min-h-[400px] mt-6 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <HotelDirectory
          data={filteredBookings}
          title="All Bookings"
          columns={currentColumns}
          filter={true}
          view={true}
          path={`/admin/booking/view`}
          editpath={`/admin/booking/edit`}
          inp={true}
          onlyFilter={true}
          checkbox={false}
          activeType={activeType}
          onDelete={handleDelete}
        />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Select
              placeholder="Select Entries"
              defaultValue={10}
              className="text-black"
              onChange={(value) => { setItemsPerPage(value); setCurrentPage(1); }}
              options={entriesPerPageOptions.map((o) => ({ label: o, value: o }))}
              showSearch
            />
            <span className="text-lightSeconday ml-4">Entries per page</span>
          </div>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={itemsPerPage}
            onChange={onPageChange}
            className="flex justify-end"
          />
        </div>
      </div>
    </>
  );
};

export default Booking;