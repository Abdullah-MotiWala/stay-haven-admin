  import Breadcrumb from "../../components/Breadcrumb"
  import MatrixCard from "../../components/MatrixCard";
  // import { rooms, roomTypes } from "../../container/data/rooms";
  import home1 from "../../assets/icons/home-1.png";
  import home2 from "../../assets//icons/home-2.png";
  import home3 from "../../assets/icons/home-3.png";
  import home4 from "../../assets/icons/home-4.png";
  import HotelDirectory from "../../components/Table";
  import { getRecentBooking, getAllBooking , deleteBooking} from "../../services/booking";
  import { getAllApartment } from "../../services/apartment"
  import { useState, useEffect, useMemo } from "react";
  import { openNotification } from "../../network/notification";
  import {} from "../../services/booking"
  const Booking = () => {
    const [activeType, setActiveType] = useState("Room Bookings");
    const [recentBookings, setRecentBookings] = useState([]);
    const [apartment, setApartment] = useState([]);

    const roomTypes = [
      "Room Bookings",
      "Apartment Bookings",
    ];
    const roomColumns = [
      { key: "bookingId", label: "Booking ID", type: "text" },
      { key: "guestName", label: "Guest Name", type: "text" },
      { key: "roomType", label: "Room Type", type: "roomType" },
      { key: "roomNumber", label: "Room Number", type: "text" },
      { key: "duration", label: "Duration", type: "text" },
      { key: "checkInOut", label: "Check-In & Check-Out", type: "dateRange" },
      { key: "status", label: "Status", type: "status" },
      { key: "action", label: "Action", type: "actions" },
    ];
    const apartmentColumns = [
      { key: "bookingId", label: "Booking ID", type: "text" },
      { key: "guestName", label: "Guest Name", type: "text" },
      { key: "apartmentName", label: "Apartment Name", type: "text" }, // Example change
      { key: "apartmentNumber", label: "Apartment Number", type: "text" }, // Example change
      { key: "hotelName", label: "Hotel Name", type: "text" }, // Example change

      { key: "duration", label: "Duration", type: "text" },
      { key: "checkInOut", label: "Check-In & Check-Out", type: "dateRange" },
      { key: "status", label: "Status", type: "status" },
      { key: "action", label: "Action", type: "actions" },
    ];

    const cardsData = [
      {
        title: "Total Bookings",
        value: "02",
        bg: "#F3F7EE",
        iconBg: "#D1E1BC",
        image: home1,
        trend: "+12%",
        trendText: "vs last week",
        showTrend: false,
      },
      {
        title: "Today's Check-ins",
        value: "24",
        bg: "#EFF9FF",
        iconBg: "#C7DAE7",
        image: home2,
      },
      {
        title: "Today's Check-outs",
        value: "05",
        bg: "#F7EFFF",
        iconBg: "#DED0EC",
        image: home3,
      },
      {
        title: "Cancelled Booking",
        value: "10",
        bg: "#F3F4FB",
        iconBg: "#CBCEE7",
        image: home4,
      }]
    const handleDelete = async (id) => {
      if (window.confirm("Are you want to delete this hotel?")) {
        try {
          await deleteBooking(id);
          setRecentBookings(recentBookings.filter((hotel) => hotel.id !== id));
          openNotification("success", "Booking deleted successfully");
        } catch (err) {
          console.error("Any Problem in deleteing", err);
          openNotification("error", "Internal Server Error");
        }
      }
    };
    useEffect(() => {
      const fetchRecentBookings = async () => {
        try {
          const res = await getAllBooking();
          console.log(res.data, "asdadsaasdas2321413");
          setRecentBookings(res.data.data);
          console.log(recentBookings, "recentBookings")
        } catch (err) {
          console.error("Failed to load stats:", err);
          openNotification("error", "Failed to load stats");
        }
      };

      fetchRecentBookings();
    }, [])

    useEffect(() => {
      const fetchApartment = async () => {
        try {
          const res = await getAllApartment();
          console.log(res.data, "apartment data");
          setApartment(res.data);
          // console.log(apartment, "Apartment")
        } catch (err) {
          console.error("Failed to load stats:", err);
          openNotification("error", "Failed to load stats");
        }
      };

      fetchApartment();
    }, [])
    const filteredBookings = useMemo(() => {
      if (activeType === "Apartment Bookings") {
        return recentBookings.filter((booking) => booking.isApartment === true);
      }

        if (activeType === "Room Bookings") {
          return recentBookings.filter((booking) => !booking.isApartment);
      }
      if (activeType === "Room Bookings") return recentBookings;

    return recentBookings;
    }, [activeType, recentBookings]);
    const currentColumns = activeType === "Apartment Bookings" ? apartmentColumns : roomColumns;
    console.log(recentBookings, "filteredBookings")
    return (<>
      <Breadcrumb title={"Booking"} />
      <MatrixCard data={cardsData} />

      <div className="p-0 ml-3 gap-[2px] inline-flex   overflow-hidden rounded-lg">
        {roomTypes.map((type, index) => (
          <button
            key={type}
            onClick={() =>  setActiveType(type)}
            className={`
              px-2 py-2 text-sm font-medium whitespace-nowrap
              transition-colors duration-200 rounded-0 m-0 
              
              ${activeType === type
                ? "bg-blue text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }
              ${index === 0 ? "" : ""}
              ${index === roomTypes.length - 1 ? "" : ""}
            `}
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
          view={false}
          path={`/admin/booking/view`}
          inp={true}
          onlyFilter={true}
          checkbox={false}
          activeType={activeType}
          onDelete={handleDelete}
        />
      </div>
    </>)
  }
  export default Booking;