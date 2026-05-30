import MatrixCard from "../MatrixCard";
import BookingList from "./bookingList";
import BookingStatus from "./bookingStatusChart";
import BookingStatistics from "./lineChart"; 
import NotificationsAlerts from "./notification";
import OpenTickets from "./openTickets";
import AvailabilityProgress from "./roomCharts";
import RoomAvailability from "./roomCharts";

const DashboardPage = ({ cardsData,bookingStatistics,recentBookings,bookingStatus, apartmentAvailability, roomsAvailability, openTickets, notifications, paginationdata, onTicketsRefresh}) => {
  return (
    <>
      <MatrixCard showshadow="true" data={cardsData} />
<<<<<<< Updated upstream
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          <BookingStatistics bookingStatistics={bookingStatistics} />
        </div>
=======
     <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 items-stretch">
  <div className="lg:col-span-2 flex flex-col">
    <BookingStatistics bookingStatistics={bookingStatistics} height={'h-full'} />
  </div>
>>>>>>> Stashed changes

  <div className="lg:col-span-1 flex flex-col">
    <AvailabilityProgress
      title="Room Availability"
      units={roomsAvailability || []}
      height={'h-full'}
    />
  </div>

  <div className="lg:col-span-1 flex flex-col">
    <BookingStatus bookingStatus={bookingStatus} height={'h-full'} />
  </div>
</div>
      <BookingList recentBookings={recentBookings} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1">
          <AvailabilityProgress
            title="Apartment Availability"
            units={apartmentAvailability || []}
          />
        </div>
        <div className="lg:col-span-1">
          <OpenTickets OpenTickets={openTickets || []} onRefresh={onTicketsRefresh} />
        </div>

        <div className="lg:col-span-1 m-0">
          <NotificationsAlerts notifications={notifications || []} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
