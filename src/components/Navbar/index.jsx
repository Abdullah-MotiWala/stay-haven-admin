import React from "react";
import { Search, Calendar, Moon, Bell, Plus } from "lucide-react"; // Plus icon add kiya
import { useNavigate } from "react-router-dom"; // Navigation ke liye

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full px-3 ">
      <div
        className="flex items-center justify-between gap-4
        bg-transparent  py-3"
      >
        {/* Search */}
        <div className="flex items-center gap-2 bg-white/70 rounded-md px-4 py-2 w-full max-w-xs shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder-gray-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* List Hotel / Room Button (Naya Button) */}
          <button 
            onClick={() => navigate("/admin/hotel/add")} // Aapka add hotel route
            className="hidden lg:flex items-center gap-2 bg-[#0A5BE2] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            <Plus size={16} />
            <span>Add New Hotel</span>
          </button>

          {/* Date */}
          <div className="hidden md:flex items-center gap-2 bg-white/60 px-4 py-2.5 rounded-full text-sm text-gray-700 font-medium shadow-sm border border-white/50">
            <Calendar size={16} />
            <span>Mon, 02 Jan 2026</span>
          </div>

          {/* Icons Group */}
          <div className="flex items-center gap-2">
            <button className="bg-white/60 p-2.5 rounded-full hover:bg-white/80 transition shadow-sm border border-white/50">
              <Moon size={18} />
            </button>

            <button className="relative bg-white/60 p-2.5 rounded-full hover:bg-white/80 transition shadow-sm border border-white/50">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex items-center border-l border-gray-300 pl-4 ml-1">
            <img
              src="https://i.pravatar.cc/40"
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