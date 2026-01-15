import Login from "../../container/auth/login";
import { PublicGuard } from "../guards";
import Signup from "../../container/auth/signUp";
export const PublicRoutes = [
  {
    path: "/",
    element: <PublicGuard />, // Security layer
    children: [
      {
        path: "login",
        element: <Login />,
      },
      { path: "signup", element: <Signup /> },
    ],
  },
];