import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userImg from "../../assets/images/dummy.png";
import bellIcon from "../../assets/icons/bellIcon.png";
import themeIcon from "../../assets/icons/theme.png";
import calendarIcon from "../../assets/icons/Calendar.png";
import headPhone from "../../assets/icons/headPhone.png";
import search from "../../assets/icons/search.svg";

import { DEFAULT_IMAGE, PAGE_CONFIG } from "../../shared/constant";
import { Button, Dropdown, Input, Modal } from "antd";
import { LogoutOutlined, SearchOutlined } from "@ant-design/icons";

const Navbar = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const currentConfig = PAGE_CONFIG[location.pathname];

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login", { replace: true });
  };

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  return (
    <header className="w-full px-3">
      <div className="flex items-center justify-between bg-transparent py-3">

        {/* Search Section */}
        <div className="flex-1 md:max-w-md lg:max-w-lg min-w-0 transition-all duration-300">
          {/* Desktop Input: Hidden on mobile */}
          <div className="hidden md:block">
            <Input
              placeholder="Search"
              prefix={<img src={search} className="w-4 h-4" />}
              // 'w-full' se ye container ki width lega, aur container screen ke mutabiq adjust hoga
              className="searchInput w-full p-2 border border-lightSeconday rounded-xl font-medium focus:border-mainPrimary hover:border-mainPrimary transition-all"
            />
          </div>

          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden bg-white p-2.5 rounded-full shadow-sm border border-white/50 active:scale-95 transition-all"
          >
            <img src={search} className="w-5 h-5" alt="search" />
          </button>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {currentConfig && (
            <button
              onClick={() => navigate(currentConfig.navigateTo)}
              className="hidden lg:flex items-center gap-2 bg-mainPrimary text-white px-4 py-2.5 rounded-3xl text-sm font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              {currentConfig.buttonText}
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-full text-sm text-lightDark font-medium shadow-sm border border-white/50">
            <img src={calendarIcon ?? DEFAULT_IMAGE} alt="calendar" />
            <span>{currentDate}</span>
          </div>

          <div className="flex items-center flex-shrink-0 gap-1">
            <button className="bg-white p-2.5 rounded-full hover:bg-white transition shadow-sm border border-white/50">
              <img src={themeIcon ?? DEFAULT_IMAGE} alt="theme" className="w-5 h-5" />
            </button>

            <button className="bg-white p-2.5 rounded-full hover:bg-white transition shadow-sm border border-white/50">
              <img src={headPhone ?? DEFAULT_IMAGE} alt="support" className="w-5 h-5" />
            </button>

            <button className="relative bg-white p-2.5 rounded-full hover:bg-white transition shadow-sm border border-white/50">
              <img src={bellIcon ?? DEFAULT_IMAGE} alt="notifications" className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>

          <div className="flex items-center border-l border-[#AEB2C9] pl-4 ml-1">
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <img
                src={DEFAULT_IMAGE}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:opacity-80 transition"
              />
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      <Modal
        title="Search"
        open={isSearchModalOpen}
        onCancel={() => setIsSearchModalOpen(false)}
        footer={null}
        centered
        closeIcon={true}
        className="mobile-search-modal"
      >
        <div className="py-4">
          <Input
            autoFocus
            placeholder="Search here..."
            prefix={<img src={search} className="w-4 h-4" />}
            className="w-full p-3 border border-lightSeconday rounded-xl font-medium"
          />
        </div>
      </Modal>
    </header>
  );
};

export default Navbar;