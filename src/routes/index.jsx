import { createBrowserRouter, Navigate } from "react-router-dom";
import {  PublicRoutes } from "./publicRoute";
import { AdminRoute } from "./adminRoute";
import { isLoggedIn } from "../utils/auth";

const RootRedirect = () => {
  if (isLoggedIn()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/auth/login" replace />;
};

const routes = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  ...PublicRoutes,
  ...AdminRoute
];

const appRoutes = createBrowserRouter(routes);

export default appRoutes;
