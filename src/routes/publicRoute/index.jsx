import Login from "../../container/auth/login";
import { PublicGuard } from "../guards";

export const PublicRoutes = [
  {
    path: "/",
    element: <PublicGuard />, // Security layer
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
];