import MatrixCard from "../MatrixCard";
import BookingList from "./bookingList";
import BookingStatus from "./bookingStatusChart";
import BookingStatistics from "./lineChart";
import NotificationsAlerts from "./notification";
import OpenTickets from "./openTickets";
import AvailabilityProgress from "./roomCharts";
import RoomAvailability from "./roomCharts";

const DashboardPage = ({ cardsData,bookingStatistics,recentBookings,bookingStatus }) => {
  return (
    <>
      <MatrixCard showshadow="true" data={cardsData} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
        <div className="lg:col-span-2">
          <BookingStatistics bookingStatistics={bookingStatistics} />
        </div>

        <div className="lg:col-span-1">
          {/* <RoomAvailability /> */}
          <AvailabilityProgress
            title="Room Availability"
            units={[
              {
                name: "One Bed Room",
                occupied: 12,
                available: 4,
                reserved: 2,
              },
              {
                name: "2 Bed Room",
                occupied: 20,
                available: 6,
                reserved: 3,
              },
              {
                name: "3 Bed Room",
                occupied: 20,
                available: 6,
                reserved: 3,
              },
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <BookingStatus  bookingStatus={bookingStatus}/>
        </div>
      </div>
      <BookingList recentBookings={recentBookings} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        <div className="lg:col-span-1">
          <AvailabilityProgress
            title="Apartment Availability"
            units={[
              {
                name: "One Bed Apartment",
                occupied: 12,
                available: 4,
                reserved: 2,
              },
              {
                name: "Two Bed Apartment",
                occupied: 20,
                available: 6,
                reserved: 3,
              },
              {
                name: "Family Apartment",
                occupied: 20,
                available: 6,
                reserved: 3,
              },
            ]}
          />
        </div>
        <div className="lg:col-span-1">
          <OpenTickets />
        </div>

        <div className="lg:col-span-1 m-0">
          <NotificationsAlerts />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
