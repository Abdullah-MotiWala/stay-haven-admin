import { PrivateGuard } from "../guards";
import HotelsListing from "../../container/dashboard/hotels"; 
import HotelView from "../../container/dashboard/hotel-view"; 
import HotelForm from "../../container/dashboard/hotel-form"; 
import AdminLayout from "../../layouts/adminLayout";

export const PrivateRoutes = [
  {
    path: "/admin", 
    element: <PrivateGuard />,
    children: [
      {
        element: <AdminLayout />, 
        children: [
          { index: true, element: <HotelsListing /> },
          { path: "hotels", element: <HotelsListing /> }, 
          { path: "hotel-view/:id", element: <HotelView /> }, 
          { path: "hotel-edit/:id", element: <HotelForm /> },
        ],
      },
    ],
  },
];