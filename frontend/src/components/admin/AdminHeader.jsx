import React from 'react';
import { Menu, Search, Bell, Settings, User, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutAdmin } from '../../services/adminAuthService';

const AdminHeader = ({ setIsMobileOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/cpanel/login');
  };

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
          <span>CPanel</span>
          <span className="mx-2">/</span>
          <span className="text-vmanous-navy-dark">Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
      </div>
    </header>
  );
};

export default AdminHeader;
