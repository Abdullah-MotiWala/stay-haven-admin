import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

export const AdminGuard = () => {
  // if (!isLoggedIn()) {
  //   return <Navigate to="/login" replace />;
  // }
  return <Outlet />;
};
export const PublicGuard = () => {
  if (isLoggedIn()) {
    return <Navigate to="/admin/hotels" replace />;
  }
  return <Outlet />;
};
