import React from "react";
// import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import userImg from "../../assets/images/dummy.png";
import bellIcon from "../../assets/icons/bellIcon.png";
import themeIcon from "../../assets/icons/theme.png";
import calendarIcon from "../../assets/icons/Calendar.png";
import headPhone from "../../assets/icons/headPhone.png";
import search from "../../assets/icons/search.svg";

import { DEFAULT_IMAGE } from "../../shared/constant";
import { Input } from "antd";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRoomPage = location.pathname === "/admin/rooms";

  return (
    <header className="w-full px-3 ">
      <div
        className="flex items-center justify-between
        bg-transparent  py-3"
      >
      
          <div className="w-96">
            <Input
              placeholder="Search"
              prefix={<img src={search} className="w-4 h-4" />}
              className="searchInput w-full p-2 border border-lightSeconday rounded-xl font-medium"
            />
          </div>

        <div className="flex items-center   ">
          <button
            onClick={() =>
              navigate(isRoomPage ? "/admin/rooms/add" : "/admin/hotel/add")
            }
            className="hidden lg:flex items-center gap-2 bg-mainPrimary text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            {isRoomPage ? "Add New Room" : "Add New Hotel"}
          </button>

          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-full text-sm text-lightDark font-medium shadow-sm border border-white/50">
            <img src={calendarIcon ?? DEFAULT_IMAGE} alt="themeIcon" />
            <span>Mon, 02 Jan 2026</span>
          </div>

          <div className="flex items-center ">
            <button className="bg-white p-2.5 rounded-full hover:bg-white transition shadow-sm border border-white/50">
              <img src={themeIcon ?? DEFAULT_IMAGE} alt="themeIcon" />
            </button>

            <button className="bg-white p-2.5 rounded-full hover:bg-white transition shadow-sm border border-white/50">
              <img src={headPhone ?? DEFAULT_IMAGE} alt="themeIcon" />
            </button>

            <button className="relative bg-white p-2.5 rounded-full hover:bg-white transition shadow-sm border border-white/50">
              <img src={bellIcon ?? DEFAULT_IMAGE} alt="themeIcon" />
              <span className="absolute top-2 right-2.5 w-2. 5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>

          <div className="flex items-center border-l border-[#AEB2C9] pl-4 ml-1">
            <img
              src={userImg ?? DEFAULT_IMAGE}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
