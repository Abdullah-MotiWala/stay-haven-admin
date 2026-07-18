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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const entriesPerPageOptions = [10, 20, 30, 40];

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab state URL se lo — back button pe restore hoga
  const tabFromUrl = searchParams.get("tab") === "apartment" ? "Apartment Bookings" : searchParams.get("tab") === "hostel" ? "Hostel Bookings" : "Room Bookings";
  const [activeType, setActiveType] = useState(tabFromUrl);

  // Back button pe URL change hone par tab sync karo
  useEffect(() => {
    setActiveType(tabFromUrl);
  }, [searchParams.get("tab")]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const roomTypes = ["Room Bookings", "Hostel Bookings", "Apartment Bookings"];

  const roomColumns = [
    { key: "bookingId",   label: "Booking ID",            type: "text" },
    { key: "guestName",   label: "Guest Name",            type: "text" },
    { key: "hotelName",   label: "Hotel",                 type: "hotelCell" },
    { key: "roomType",    label: "Room Type",             type: "roomType" },
    { key: "roomNumber",  label: "Room Number",           type: "text" },
    { key: "duration",    label: "Duration",              type: "text" },
    { key: "checkInOut",  label: "Check-In & Check-Out",  type: "dateRange" },
    { key: "status",      label: "Status",                type: "status" },
    { key: "action",      label: "Action",                type: "actions" },
  ];

  const hostelColumns = [
    { key: "bookingId",   label: "Booking ID",            type: "text" },
    { key: "guestName",   label: "Guest Name",            type: "text" },
    { key: "hotelName",   label: "Hotel",                 type: "hotelCell" },
    { key: "roomType",    label: "Hostel Type",           type: "roomType" },
    { key: "roomNumber",  label: "Bed/Room Number",       type: "text" },
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

  const fetchBookings = async (type, page, limit) => {
    try {
      setLoading(true);
      const isApartment = (type ?? activeType) === "Apartment Bookings";
      const res = await getAllBooking(page ?? currentPage, limit ?? itemsPerPage, isApartment);
      let bookings = res.data?.data || [];

      // Hostel tab: filter by isHostel=true, Room tab: filter by isHostel=false
      if ((type ?? activeType) === "Hostel Bookings") {
        bookings = bookings.filter((b) => b.isHostel === true);
      } else if ((type ?? activeType) === "Room Bookings") {
        bookings = bookings.filter((b) => b.isHostel === false);
      }

      setRecentBookings(bookings);
      setTotal(res.data?.meta?.totalItems || res.data?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      openNotification("error", "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Stats sirf ek baar
  useEffect(() => {
    fetchStats();
  }, []);

  // Tab change → page 1 se start, naya fetch
  useEffect(() => {
    setCurrentPage(1);
    fetchBookings(activeType, 1, itemsPerPage);
  }, [activeType]);

  // Page / limit / location change
  useEffect(() => {
    fetchBookings(activeType, currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, location.key]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you want to delete this booking?")) {
      try {
        await deleteBooking(id);
        openNotification("success", "Booking deleted successfully");
        fetchBookings(activeType, currentPage, itemsPerPage);
      } catch (err) {
        openNotification("error", "Internal Server Error");
      }
    }
  };

  const currentColumns =
    activeType === "Apartment Bookings" ? apartmentColumns :
    activeType === "Hostel Bookings" ? hostelColumns :
    roomColumns;

  const sc = stats?.statusCounts ?? {};
  const checkedInCount  = (sc["Checked-In"]  ?? 0) + (sc["Checkin"]  ?? 0);
  const checkedOutCount = (sc["Checked-Out"] ?? 0) + (sc["Checked-out"] ?? 0) + (sc["Checkout"] ?? 0) + (sc["Completed"] ?? 0);
  const cancelledCount  = sc["Cancelled"] ?? sc["Canceled"] ?? 0;

  const cardsData = [
    { title: "Total Bookings",     value: stats?.totalBookings ?? "—", bg: "#F3F7EE", iconBg: "#D1E1BC", image: home1, showTrend: false },
    { title: "Today's Check-in",  value: stats ? checkedInCount  : "—", bg: "#EFF9FF", iconBg: "#C7DAE7", image: home2 },
    { title: "Today's Check-out", value: stats ? checkedOutCount : "—", bg: "#F7EFFF", iconBg: "#DED0EC", image: home3 },
    { title: "Cancelled Booking",  value: stats ? cancelledCount  : "—", bg: "#F3F4FB", iconBg: "#CBCEE7", image: home4 },
  ];

  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  return (
    <>
      <Breadcrumb title="Booking" />
      <MatrixCard data={cardsData} />

      <div className="p-0 mt-6 ml-3 gap-[2px] inline-flex overflow-hidden rounded-lg">
        {roomTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveType(type);
              setSearchParams({ tab: type === "Apartment Bookings" ? "apartment" : type === "Hostel Bookings" ? "hostel" : "room" });
            }}
            className={`px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 rounded-0 m-0 ${
              activeType === type
                ? "bg-blue text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="min-h-[400px] mt-6 bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <span className="ml-3 text-blue-600 font-medium">Loading...</span>
          </div>
        ) : (
          <HotelDirectory
            data={recentBookings}
            title="All Bookings"
            columns={currentColumns}
            filter={true}
            view={true}
            path={`/admin/booking/view`}
            viewpath={`/admin/booking/view`}
            editpath={`/admin/booking/edit`}
            inp={true}
            onlyFilter={true}
            exportFileName="bookings.csv"
            checkbox={false}
            activeType={activeType}
            onDelete={handleDelete}
            disableEditStatuses={["checked-out", "cancelled", "completed"]}
          />
        )}

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Select
              placeholder="Select Entries"
              defaultValue={10}
              className="text-black"
              onChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
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
            className="admin-pagination flex justify-end flex-wrap"
          />
        </div>
      </div>
    </>
  );
};

export default Booking;