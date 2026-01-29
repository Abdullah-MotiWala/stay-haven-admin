import React from "react";
// Import Admin Guard and Layout first
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
// import Login from "../../container/auth/login/index.jsx";
// import Signup from "../../container/auth/signUp/index.jsx";

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
          
          { path: "tickets", element: <TicketsPage/> },
          { path: "tickets/:ticketId/chat", element: <ChatWindow/>},

          
          { path: "settings", element: <SettingParent /> },

          // { path: "login", element: <Login/> }
          // { path: "signup", element: <Signup/> }
          


        ],
      },
    ],
  },
];
