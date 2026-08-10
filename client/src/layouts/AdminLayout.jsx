import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar placeholder */}
      <aside className="w-64 border-r border-gray-800 hidden md:block">
        <div className="p-6">Admin Sidebar (Placeholder)</div>
      </aside>
      
      <main className="flex-1 flex flex-col">
        {/* Header placeholder */}
        <header className="h-16 border-b border-gray-800 flex items-center px-6 bg-gray-900">
          Admin Header (Placeholder)
        </header>
        
        <div className="p-6 flex-1 overflow-auto bg-gray-800">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
