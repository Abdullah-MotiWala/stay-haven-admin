import React from 'react';
// Import Admin Guard and Layout first
import { AdminGuard } from "../guards";
import AdminLayout from "../../layouts/adminLayout";
import Hotels from "../../container/hotels/hotels/index";
import AddHotel from "../../container/hotels/add-hotels/index";
import HotelView from "../../container/hotels/hotel-view/index";
 import RoomDetailsForm from "../../components/roomsForm";
// import RoomDetail from '../../components/roomDetail';
 import AddRooms from '../../container/rooms/addRooms';
import Room from "../../container/rooms";
// import Ticket from "../../container/hotels/tickets";
// import TicketView from "../../container";
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
          { path: "rooms/add", element: <RoomDetailsForm /> },
          { path: "rooms/edit/:id ", element: <RoomDetailsForm /> },
          
           { path: "rooms/addnext", element: <AddRooms /> },
            {path:"rooms" , element:<Room/>},
            // {path:"tickets" , element:<Ticket/>},
            // {path:"ticket/view" ,element:<TicketView/>}


        ],
      },
    ],
  },
];