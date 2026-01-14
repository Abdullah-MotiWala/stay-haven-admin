import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Drawer } from "antd";

import {
  AppstoreOutlined,
  ShopOutlined,
  KeyOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png";

const menuItems = [
  { key: "/admin/dashboard", icon: <AppstoreOutlined />, label: <Link to="/admin/dashboard">Dashboard</Link> },
  { key: "/admin/hotels", icon: <ShopOutlined />, label: <Link to="/admin/hotels">Hotels</Link> },
  { key: "/admin/rooms", icon: <KeyOutlined />, label: <Link to="/admin/rooms">Rooms</Link> },
  { key: "/admin/bookings", icon: <CalendarOutlined />, label: <Link to="/admin/bookings">Bookings</Link> },
  { key: "/admin/tickets", icon: <CustomerServiceOutlined />, label: <Link to="/admin/tickets">Tickets</Link> },
  { key: "/admin/settings", icon: <SettingOutlined />, label: <Link to="/admin/settings">Settings</Link> },
];

const SidebarContent = ({ location }) => (
  <div className="flex flex-col h-full">
    <div className="p-8 flex justify-center">
      <img src={logo} alt="STAY HAVEN" className="w-32 object-contain" />
    </div>

    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      className="px-4 sidebar-menu font-medium text-gray-500"
    />

    <div className="p-6 mt-auto border-t border-gray-100">
      <Button
        icon={<LogoutOutlined />}
        block
        className="rounded-xl h-12 bg-gray-50 text-gray-500 font-semibold"
      >
        Logout
      </Button>
    </div>
  </div>
);

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
      {/* Mobile Top Menu Icon */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
            className="bg-white shadow-md"
          />
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Layout.Sider
          width={260}
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
