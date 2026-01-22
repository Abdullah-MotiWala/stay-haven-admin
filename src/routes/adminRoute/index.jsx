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
export const AdminRoute = [
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          // { path: "hotels", element: <hotels /> },
          { path: "hotels", element: <Hotels /> },
          { path: "hotel/add", element: <AddHotel /> },
          { path: "hotel/edit/:id", element: <AddHotel /> },
          { path: "hotel/view/:id", element: <HotelView /> },
          { path: "rooms/edit/:id", element: <AddNewRoom /> },
          { path: "rooms/add", element: <AddNewRoom /> },

          { path: "rooms/addnext", element: <AddRooms /> },
          { path: "rooms", element: <Room /> },
          { path: "booking", element: <Booking /> },
          { path: "booking/view/:id", element: <BookingView /> },
          { path: "booking/add", element: <AddBooking /> },

          // {path:"tickets" , element:<Ticket/>},
          // {path:"ticket/view" ,element:<TicketView/>}
        ],
      },
    ],
  },
];
