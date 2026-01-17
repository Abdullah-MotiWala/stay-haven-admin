// layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Navbar from "../components/Navbar"

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full  overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative px-3">
        {/* <div className=" "> */}
          <Navbar />
          <Outlet />
        {/* </div> */}
      </main>
    </div>
  );
};

export default AdminLayout;