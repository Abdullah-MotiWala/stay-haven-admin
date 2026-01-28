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
} from "../../services/dashboard/";
import { openNotification } from "../../network/notification";
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookingStatistics, setBookingStatistics] = useState(null);
  const [roomsAvailability, setRoomsAvailability] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [recentBookings, setRecentBookings] = useState(null);

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
        recentBookingsRes,
      ] = await Promise.all([
        getStats(),
        getBookingStatistics(),
        getRoomsAvailability(),
        getBookingStatus(),
        getCustomers(),
        getRecentBookings(),
      ]);

      setStats(statsRes?.data?.data);
      setBookingStatistics(bookingStatsRes?.data?.data);
      setRoomsAvailability(roomsAvailabilityRes?.data?.data);
      setBookingStatus(bookingStatusRes?.data?.data);
      setCustomers(customersRes?.data?.data);
      setRecentBookings(recentBookingsRes?.data);

      console.log("Stats:", statsRes?.data?.data);
      console.log("Booking Statistics:", bookingStatsRes?.data?.data);
      console.log("Rooms Availability:", roomsAvailabilityRes?.data?.data);
      console.log("Booking Status:", bookingStatusRes?.data?.data);
      console.log("Customers:", customersRes?.data?.data);
      console.log("Recent Bookings:", recentBookingsRes?.data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      openNotification("error", "Failed to load dashboard data");
    }
  };
  console.log(bookingStatistics, "statsstatsstats");
  const cardsData = [
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      bg: "#F3F7EE",
      iconBg: "#D1E1BC",
      image: home1,
      trend: "+12%",
      trendText: "vs last week",
      showTrend: true,
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
      <DashboardPage cardsData={cardsData} bookingStatistics={bookingStatistics} recentBookings={recentBookings} bookingStatus={bookingStatus}/>
    </div>
  );
};

export default Dashboard;
