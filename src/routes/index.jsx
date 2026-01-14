import { createBrowserRouter } from "react-router-dom";
import {  PublicRoutes } from "./publicRoute";
import { PrivateRoutes } from "./privateRoute";
import { AdminRoute } from "./adminRoute";

const routes = [...PublicRoutes, ...PrivateRoutes, ...AdminRoute];

const appRoutes = createBrowserRouter(routes);

export default appRoutes;
