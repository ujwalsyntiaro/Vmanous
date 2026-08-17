import React from 'react';
import { Menu, Search, Bell, Settings, User } from 'lucide-react';

const AdminHeader = ({ setIsMobileOpen }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-vmanous-navy-dark hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Breadcrumb Placeholder */}
        <div className="hidden sm:flex items-center text-sm font-medium text-gray-500">
          <span>Admin</span>
          <span className="mx-2">/</span>
          <span className="text-vmanous-navy-dark">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-vmanous-navy-dark hover:bg-gray-100 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-gray-400 hover:text-vmanous-navy-dark hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
            <Settings size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* Profile Dropdown Placeholder */}
        <div className="flex items-center gap-2 cursor-pointer p-1 pr-2 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
            A
          </div>
          <span className="text-sm font-semibold text-vmanous-navy-dark hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
