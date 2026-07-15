import Header from "../components/website/header";
import Sidebar from "../components/website/sidebar";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
