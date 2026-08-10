import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">Dashboard Sidebar (Placeholder)</div>
      </aside>
      
      <main className="flex-1 flex flex-col">
        {/* Header placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          Dashboard Header (Placeholder)
        </header>
        
        <div className="p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
