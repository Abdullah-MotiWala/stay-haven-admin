import React from 'react';
// Import Admin Guard and Layout first
import { AdminGuard } from "../guards";
import AdminLayout from "../../layouts/adminLayout";
import Dashboard from "../../container/dashboard/hotels/index";
import Hotels from "../../container/dashboard/hotels/index";
import AddHotel from "../../container/dashboard/add-hotels/index";
import HotelView from "../../container/dashboard/hotel-view/index";
import RoomDetailsForm from "../../components/roomsForm";
import RoomDetail from '../../components/roomDetail';
import AddRooms from '../../container/dashboard/addRooms';
import Room from "../../container/dashboard/rooms";
export const AdminRoute = [
  {
    path: "/admin",
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "hotels", element: <Hotels /> },
          { path: "add-hotel", element: <AddHotel /> },
          { path: "hotel-view", element: <HotelView /> },
          { path: "rooms/add", element: <RoomDetailsForm /> },
          { path: "rooms/addnext", element: <AddRooms /> },
            {path:"rooms" , element:<Room/>}

        ],
      },
    ],
  },
];