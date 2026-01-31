import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

export const AdminGuard = () => {
  if (!isLoggedIn()) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};
export const PublicGuard = () => {
  if (isLoggedIn()) {
    return <Navigate to="/admin/dsshboard" replace />;
  }

  // if (!isAdmin()) {
  //   return <Navigate to="/login" replace />; 
  // }

  return <Outlet />;
};
