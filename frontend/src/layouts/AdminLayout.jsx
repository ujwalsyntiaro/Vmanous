import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex font-sans text-vmanous-navy-dark">
      {/* Sidebar */}
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all duration-300 bg-white">
        <AdminHeader setIsMobileOpen={setIsMobileOpen} />
        
        <main className="flex-1 p-3.5 sm:p-4 lg:p-5 overflow-x-hidden bg-white">
          {/* This will render the specific admin page components based on the route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
