import React from "react";
import { Search, Calendar, Moon, Bell } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full px-2">
      <div
        className="flex items-center justify-between gap-4
        bg-transparent  rounded-xl
        px-4 py-3"
      >
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/70 rounded-full px-3 py-2 w-full max-w-xs">
          <Search size={18} className="text-gray-500  " />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Date */}
          <div className="hidden md:flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full text-sm text-gray-700">
            <Calendar size={16} />
            <span>Mon, 02 Jan 2026</span>
          </div>

          {/* Icons */}
          <button className="bg-white/60 p-2 rounded-full hover:bg-white/80 transition">
            <Moon size={18} />
          </button>

          <button className="relative bg-white/60 p-2 rounded-full hover:bg-white/80 transition">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-9 h-9 rounded-full object-cover border border-white"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
