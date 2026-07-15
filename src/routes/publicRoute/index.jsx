import Login from "../../container/auth/login";
import { PublicGuard } from "../guards";
import Signup from "../../container/auth/signUp";
export const PublicRoutes = [
  {
    path: "/auth",
    element: <PublicGuard />, 
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      { path: "/auth/signup", element: <Signup /> },
    ],
  },
];