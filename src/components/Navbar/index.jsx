import React from "react";
import { Search, Calendar, Moon, Bell, Plus } from "lucide-react"; // Plus icon add kiya
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import userImg from "../../assets/images/dummy.png";
import bellIcon from "../../assets/icons/bellIcon.png";
import themeIcon from "../../assets/icons/theme.png";
import calendarIcon from "../../assets/icons/Calendar.png";
import headPhone from "../../assets/icons/headPhone.png";
import { DEFAULT_IMAGE } from "../../shared/constant";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-3 ">
      <div
        className="flex items-center justify-between
        bg-transparent  py-3"
      >
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/70 rounded-md px-4 py-2 w-full max-w-xs shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-full h-51 text-gray-700 placeholder-gray-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center ">
          {/* List Hotel / Room Button (Naya Button) */}
          <button
            onClick={() => navigate("/admin/hotel/add")} // Aapka add hotel route
            className="hidden lg:flex items-center gap-2 bg-[#0A5BE2] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            Add New Hotel
          </button>

          {/* Date */}
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
              {/* <Bell size={18} /> */}
              <img src={bellIcon ?? DEFAULT_IMAGE} alt="themeIcon" />
              <span className="absolute top-2 right-2.5 w-2. 5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>

          {/* Profile Section */}
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
