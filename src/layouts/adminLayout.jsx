// layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Navbar from "../components/Navbar"

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full  overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-4 md:p-8">
          <Navbar />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;