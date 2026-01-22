import Breadcrumb  from "../../components/Breadcrumb"
import MatrixCard from "../../components/MatrixCard";
// import { rooms, roomTypes } from "../../container/data/rooms";
import home1 from "../../assets/icons/home-1.png";
import home2 from "../../assets//icons/home-2.png";
import home3 from "../../assets/icons/home-3.png";
import home4 from "../../assets/icons/home-4.png";
import HotelDirectory from "../../components/Table";
import { getRecentBooking , getAllBooking } from "../../services/booking";
import { useState, useEffect , useMemo} from "react";
import { openNotification } from "../../network/notification";
const Booking = ()=>{
   const [activeType, setActiveType] = useState("All Booking");
    const [recentBookings, setRecentBookings] = useState([]);
  const roomTypes = [
   "All Booking",
   "Active Booking",
   "Completed Bookings",
   "Cancelled Bookings"
 ];
  const columns = [
    { key: "bookingId", label: "Booking ID", type: "text" },
    { key: "guestName", label: "Guest Name", type: "text" },
    { key: "roomType", label: "Room Type", type: "roomType" },
    { key: "roomNumber", label: "Room Number", type: "text" },
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
          value:"24",
          bg: "#EFF9FF",
          iconBg: "#C7DAE7",
          image: home2,
        },
        {
          title: "Today's Check-outs",
          value:"05",
          bg: "#F7EFFF",
          iconBg: "#DED0EC",
          image: home3,
        },
        {
          title: "Cancelled Booking",
          value:"10",
          bg: "#F3F4FB",
          iconBg: "#CBCEE7",
          image: home4,
        }]

         useEffect(() => {
            const fetchRecentBookings = async () => {
              try {
                const res = await getAllBooking();
                console.log(res.data, "asdadsaasdas2321413");
                setRecentBookings(res.data);
                console.log(recentBookings, "recentBookings")
              } catch (err) {
                console.error("Failed to load stats:", err);
                openNotification("error", "Failed to load stats");
              }
            };
        
            fetchRecentBookings();
          }, [])


          const filteredBookings = useMemo(() => {
    if (activeType === "All Booking") return recentBookings;
    
    return recentBookings.filter((booking) => {
      // API status values check karein (Booked, Completed, Cancelled)
      if (activeType === "Active Booking") return booking.status?.toLowerCase() === "booked";
      if (activeType === "Completed Bookings") return booking.status?.toLowerCase() === "completed";
      if (activeType === "Cancelled Bookings") return booking.status?.toLowerCase() === "cancelled";
      return true;
    });
  }, [activeType, recentBookings]);
      console.log(recentBookings, "filteredBookings")
    return(<>
    <Breadcrumb title={"Booking"}/>
    <MatrixCard data={cardsData}/>

     <div className="p-0 ml-3 gap-[2px] inline-flex   overflow-hidden rounded-lg">
            {roomTypes.map((type, index) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
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
                    columns={columns}
                    filter={true}
                    view={false}
                    path={`/admin/booking/view`}
                    inp={true}
                    onlyFilter={true}
                  />
                </div>
    </>)
}
export default Booking;