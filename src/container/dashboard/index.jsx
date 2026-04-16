import React, { useEffect, useState } from "react";
import DashboardPage from "../../components/dashboard";

import home1 from "../../assets/images/calendarCheck.svg";
import home2 from "../../assets//icons/home-2.png";
import home3 from "../../assets/images/room.svg";
import home4 from "../../assets/images/revenue.svg";
import {
  getBookingStatistics,
  getStats,
  // getBookingStatistics,
  getRoomsAvailability,
  getBookingStatus,
  getCustomers,
  getRecentBookings,
  getApartmentAvailability,
  getOpenTickets
} from "../../services/dashboard/";
import { getAllBooking } from "../../services/booking"
import { openNotification } from "../../network/notification";
import { getNotificationApi } from "../../services/notification";
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookingStatistics, setBookingStatistics] = useState(null);
  const [roomsAvailability, setRoomsAvailability] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [recentBookings, setRecentBookings] = useState(null);
  const [apartmentAvailability, setApartmentAvailability] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allBooking, setAllBookings] = useState([]);
  const [paginationdata, setPaginationData] = useState([]);

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      const [
        statsRes,
        bookingStatsRes,
        roomsAvailabilityRes,
        bookingStatusRes,
        customersRes,
        // recentBookingsRes,
        apartmentRes,
        openTicketsRes,
        notifications,
        AllBooking
      ] = await Promise.all([
        getStats(),
        getBookingStatistics(),
        getRoomsAvailability(),
        getBookingStatus(),
        getCustomers(),
        // getRecentBookings(),
        getApartmentAvailability(),
        getOpenTickets(),
        getNotificationApi(),
        getAllBooking()


      ]);

      setStats(statsRes?.data?.data);
      setBookingStatistics(bookingStatsRes?.data?.data);
      setRoomsAvailability(roomsAvailabilityRes?.data?.data);
      setBookingStatus(bookingStatusRes?.data?.data);
      setCustomers(customersRes?.data?.data);
      // setRecentBookings(recentBookingsRes?.data);
      setApartmentAvailability(apartmentRes?.data?.data || []);
      setOpenTickets(openTicketsRes?.data?.data)
      setNotifications(notifications?.data?.data || []);
      setAllBookings(AllBooking?.data?.data || []);
      setPaginationData(AllBooking?.data || []);
    } catch (err) {
      console.error("Dashboard API error:", err);
      openNotification("error", "Failed to load dashboard data");
    }
  };
  const cardsData = [
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: `${(stats?.bookingGrowth ?? 0) >= 0 ? '+' : ''}${stats?.bookingGrowth ?? 0}%`,
      trendText: "vs last week",
      showTrend: true,
      trendColor: (stats?.bookingGrowth ?? 0) >= 0 ? "green" : "red",
    },
    {
      title: "Hotels Listed",
      value: stats?.hotelsListed ?? 0,
      bg: "#EFF9FF",
      iconBg: "#C7DAE7",
      image: home2,
    },
    {
      title: "Available Rooms",
      value: stats?.availableRooms ?? 0,
      bg: "#F7EFFF",
      iconBg: "#DED0EC",
      image: home3,
    },
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ?? 0,
      bg: "#F3F4FB",
      iconBg: "#CBCEE7",
      image: home4,
    },
  ];
  return (
    <div>
      <DashboardPage cardsData={cardsData} bookingStatistics={bookingStatistics} recentBookings={allBooking} bookingStatus={bookingStatus} apartmentAvailability={apartmentAvailability} roomsAvailability={roomsAvailability} openTickets={openTickets} notifications={notifications} paginationdata={paginationdata} />
    </div>
  );
};

export default Dashboard;
