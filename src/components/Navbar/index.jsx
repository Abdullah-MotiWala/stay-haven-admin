import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bellIcon from "../../assets/icons/bellIcon.png";
import calendarIcon from "../../assets/icons/Calendar.png";
import search from "../../assets/icons/search.svg";
import { DEFAULT_IMAGE, PAGE_CONFIG } from "../../shared/constant";
import { Dropdown, Input, Modal, Badge } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { getAllNotifications } from "../../services/notification";
import { getProfile } from "../../services/profile/index"
import socket from "../../services/socket";
import { useSelector } from "react-redux";
import { getUnreadCount } from "../../redux/features/notification";
const Navbar = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  // const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState()
  const unreadCount = useSelector(getUnreadCount);

  const fetchUnreadCount = async () => {
    try {
      const res = await getAllNotifications();
      const count = (res?.data?.data || []).filter(n => !n.isRead).length;
      // setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  

  useEffect(() => {
    fetchUnreadCount();

    // Realtime: socket se notification aaye to count update karo
    const handleNewNotification = (data) => {
      // If backend sends count directly use it, otherwise refetch
      if (data?.count !== undefined) {
        // setUnreadCount(data.count);
      } else {
        fetchUnreadCount();
      }
    };

    socket.on("notification-received", handleNewNotification);

    return () => {
      socket.off("notification-received", handleNewNotification);
    };
  }, []);

  useEffect(async () => {
    const profile = await getProfile();
    const res = profile.data.data
    setProfileImage(res.profileImage)
    console.log("profile log ", res)

  }, [])
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
      key: "profile",
      icon: <UserOutlined />,
      label: "My Profile",
      onClick: () => navigate("/admin/profile"),
    },
    {
      type: "divider",
    },
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
        {/* <div className="flex-1 md:max-w-md lg:max-w-lg min-w-0 transition-all duration-300">
          <div className="hidden md:block">
            <Input
              placeholder="Search"
              prefix={<img src={search} className="w-4 h-4" />}
              // 'w-full' se ye container ki width lega, aur container screen ke mutabiq adjust hoga
              className="searchInput w-full p-2 border border-lightSeconday rounded-xl font-medium focus:border-mainPrimary hover:border-mainPrimary transition-all"
            />
          </div>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden bg-white p-2.5 rounded-full shadow-sm border border-white/50 active:scale-95 transition-all"
          >
            <img src={search} className="w-5 h-5" alt="search" />
          </button>
        </div> */}

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
            <Badge
              count={unreadCount}
              offset={[-5, 15]}
              style={{ backgroundColor: '#8B0000' }}
            >
              <button
                onClick={() => navigate("/admin/notifications")}
                className="relative bg-white p-2.5 rounded-full hover:bg-white transition shadow-sm border border-white/50"
              >
                <img src={bellIcon ?? DEFAULT_IMAGE} alt="notifications" className="w-5 h-5" />
              </button>
            </Badge>
          </div>

          <div className="flex items-center border-l border-[#AEB2C9] pl-4 ml-1">
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <img
                src={profileImage || DEFAULT_IMAGE}
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