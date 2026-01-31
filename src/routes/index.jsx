import { createBrowserRouter } from "react-router-dom";
import {  PublicRoutes } from "./publicRoute";
import { AdminRoute } from "./adminRoute";
import { Navigate } from "react-router-dom";


const RootRedirect = {
  path: "/",
  element: <Navigate to="/admin/dashboard" replace />,
};

const routes = [RootRedirect,...PublicRoutes,  ...AdminRoute];

const appRoutes = createBrowserRouter(routes);

export default appRoutes;
