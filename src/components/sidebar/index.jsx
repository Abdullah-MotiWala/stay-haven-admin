import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Drawer, Modal } from "antd";

import {
  AppstoreOutlined,
  ShopOutlined,
  KeyOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";


import logo from "../../assets/images/logo-haven.svg";
import dashboardIcon from "../../assets/images/dashbi.svg";
import hotelIcon from "../../assets/images/home.svg";
import roomIcon from "../../assets/images/IconHotel.svg";
import appartmentIcon from "../../assets/images/appartments.svg";
import bookingIcon from "../../assets/images/bookings.svg";
import ticketIcon from "../../assets/images/tickets.svg";
import settingIcon from "../../assets/images/setting.svg";
const iconStyle = "w-5 h-5 object-contain";

const menuItems = [
  {
    key: "/admin/dashboard",
    icon: <img src={dashboardIcon} className={iconStyle} alt="dashboard" />,
    label: <Link to="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "/admin/hotels",
    icon: <img src={hotelIcon} className={iconStyle} alt="hotels" />,
    label: <Link to="/admin/hotels">Hotels</Link>,
  },
  {
    key: "/admin/rooms",
    icon: <img src={roomIcon} className={iconStyle} alt="rooms" />,
    label: <Link to="/admin/rooms">Rooms</Link>,
  },
  {
    key: "/admin/appartments",
    icon: <img src={appartmentIcon} className={iconStyle} alt="appartments" />,
    label: <Link to="/admin/appartments">Appartments</Link>,
  },
  {
    key: "/admin/hostels",
    icon: <img src={roomIcon} className={iconStyle} alt="hostels" />,
    label: <Link to="/admin/hostels">Hostels</Link>,
  },
  {
    key: "/admin/bookings",
    icon: <img src={bookingIcon} className={iconStyle} alt="bookings" />,
    label: <Link to="/admin/bookings">Bookings</Link>,
  },
  {
    key: "/admin/reports",
    icon: <FileTextOutlined className={iconStyle} />,
    label: <Link to="/admin/reports">Reports</Link>,
  },
  {
    key: "/admin/tickets",
    icon: <img src={ticketIcon} className={iconStyle} alt="tickets" />,
    label: <Link to="/admin/tickets">Tickets</Link>,
  },
  {
    key: "/admin/hosts",
    icon: <UserOutlined className={iconStyle} />,
    label: <Link to="/admin/hosts">Hosts</Link>,
  },
  {
    key: "/admin/contact-messages",
    icon: <CustomerServiceOutlined className={iconStyle} />,
    label: <Link to="/admin/contact-messages">Contact Messages</Link>,
  },
  // {
  //   key: "/admin/contact-messages",
  //   icon: <CustomerServiceOutlined className={iconStyle} />,
  //   label: <Link to="/admin/contact-messages">Contact Messages</Link>,
  // },
  {
    key: "/admin/settings",
    icon: <img src={settingIcon} className={iconStyle} alt="settings" />,
    label: <Link to="/admin/settings">Settings</Link>,
  },
];


const SidebarContent = ({ location }) => {
  const navigate = useNavigate();

  // --- Logout Function ---
  const handleLogout = () => {
    Modal.confirm({
      title: 'Do you want to logout?',
      icon: <ExclamationCircleOutlined />,
      content: 'You will need to login again to access the dashboard.',
      okText: 'Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        // 1. LocalStorage se sab saaf kar dein
        localStorage.clear();
        // 2. Wapas login page par bhej dein
        navigate("/auth/login", { replace: true });
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex justify-center mb-16 mt-10">
        <img src={logo} alt="STAY HAVEN" className=" object-contain" />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="px-2 sidebar-menu font-medium text-gray-500"
      />

      <div className="p-2 mt-auto border-t border-gray-100">
        <Button
          icon={<LogoutOutlined />}
          block
          onClick={handleLogout} // Click handler connect kiya
          className="rounded-md h-10 m-0 bg-white text-lightRed font-medium border-lightRed  hover:!border-blue hover:!text-blue"
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
            className="bg-white shadow-md"
          />
        </div>
      )}

      {!isMobile && (
        <Layout.Sider
          width={197}
          theme="light"
          className="h-screen sticky top-0 border-r shadow-sm"
        >
          <SidebarContent location={location} />
        </Layout.Sider>
      )}

      {/* Mobile Drawer Sidebar */}
      <Drawer
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        width={260}
        bodyStyle={{ padding: 0 }}
        className="lg:hidden"
      >
        <SidebarContent location={location} />
      </Drawer>
    </>
  );
};

export default Sidebar;
