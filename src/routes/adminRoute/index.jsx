import React from "react";
import { AdminGuard } from "../guards";
import AdminLayout from "../../layouts/adminLayout";
import Hotels from "../../container/hotels/hotels/index";
import AddHotel from "../../container/hotels/add-hotels/index";
import HotelView from "../../container/hotels/hotel-view/index";
import AddRooms from "../../container/rooms/addRoom";
import Room from "../../container/rooms";
import Booking from "../../container/booking";
import BookingView from "../../container/booking/bookingView";
import AddBooking from "../../container/booking/addBooking";
import AddNewRoom from "../../container/rooms/addRoom";
import Appartments from "../../container/appartment";
import AddNewAppartment from "../../container/appartment/addAppartment";
import ChatWindow from "../../components/ticketChat.jsx";
import TicketsPage from "../../components/TicketPage.jsx";
import SettingParent from "../../container/settings";
import Hosts from "../../container/hosts";
import AddHost from "../../container/hosts/addHost";
import HostelListing from "../../container/hostels";
import AddHostel from "../../container/hostels/addHostel";
import HotelBookingDashboard from "../../container/dashboard";

export const AdminRoute = [
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <HotelBookingDashboard /> },
          { path: "hosts", element: <Hosts /> },
          { path: "hosts/add", element: <AddHost /> },
          { path: "hosts/edit/:id", element: <AddHost /> },
          { path: "hotels", element: <Hotels /> },
          { path: "hotel/add", element: <AddHotel /> },
          { path: "hotel/edit/:id", element: <AddHotel /> },
          { path: "hotel/view/:id", element: <HotelView /> },
          { path: "rooms", element: <Room /> },
          { path: "rooms/add", element: <AddNewRoom /> },
          { path: "rooms/edit/:id", element: <AddNewRoom /> },
          { path: "appartments", element: <Appartments /> },
          { path: "appartments/add", element: <AddNewAppartment /> },
          { path: "appartment/edit/:id", element: <AddNewAppartment /> },
          { path: "bookings", element: <Booking /> },
          { path: "booking/view/:id", element: <BookingView /> },
          { path: "booking/add", element: <AddBooking /> },
          { path: "booking/edit/:id", element: <AddBooking /> },
          { path: "tickets", element: <TicketsPage /> },
          { path: "tickets/:ticketId/chat", element: <ChatWindow /> },
          { path: "settings", element: <SettingParent /> },
          { path: "hostels", element: <HostelListing /> },
          { path: "hostels/add", element: <AddHostel /> },
          { path: "hostels/edit/:id", element: <AddHostel /> },
        ],
      },
    ],
  },
];
