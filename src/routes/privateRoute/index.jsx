import { PrivateGuard } from "../guards";
import HotelsListing from "../../container/hotels/hotels"; 
import HotelView from "../../container/hotels/hotel-view"; 
import HotelForm from "../../container/hotels/hotel-form"; 
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
          { path: "hotel-add", element: <HotelForm /> },
          { path: "hotel-edit/:id", element: <HotelForm /> },
        ],
      },
    ],
  },
];