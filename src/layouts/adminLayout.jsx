// layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full bg-[#F4F7FE] overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative">
        <div className="p-4 md:p-8">
            <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;