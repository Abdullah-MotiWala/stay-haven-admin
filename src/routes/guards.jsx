import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, isAdmin } from "../utils/auth";

export const AdminGuard = () => {
  if (!isLoggedIn()) return <Navigate to="/login" />;
  if (!isAdmin()) return <Navigate to="/" />;
  return <Outlet />;
};

export const PrivateGuard = () => {
  if (!isLoggedIn()) return <Navigate to="/login" />;
  return <Outlet />;
};

export const PublicGuard = () => {
  return <Outlet />;
};
