import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { logoutAdmin } from '../../services/adminAuthService';
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  Calendar,
  Microscope,
  FileText,
  Award,
  Mail,
  Settings,
  BarChart3,
  Image,
  LogOut,
  X
} from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/cpanel/login');
  };

  const navigation = [
    { name: 'Dashboard', path: '/cpanel', icon: LayoutDashboard, exact: true, hasDividerAfter: true },
    { name: 'Onboard AI Summit', path: '/cpanel/ai-summits', icon: Calendar, hasDividerAfter: true },
    { name: 'Applications / Reports', path: '/cpanel/applications', icon: FileText, hasDividerAfter: true },
    { name: 'Manage Gallery', path: '/cpanel/gallery', icon: Image, hasDividerAfter: true },
    { name: 'Manage Certificates', path: '/cpanel/certificates', icon: Award, hasDividerAfter: true },
    { name: 'Settings', path: '/cpanel/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-gray-900 border-r border-gray-200">
      {/* Logo Area with Bottom Divider Line */}
      <div className="p-4 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-900"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links with Horizontal Dividers */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="px-3 space-y-1">
          {navigation.map((item, idx) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={idx}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold border-r-2 border-emerald-500 rounded-r-none'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                    }`
                  }
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
                {item.hasDividerAfter && <div className="border-t border-gray-100 my-1" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs shrink-0">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">AM</p>
              <p className="text-[11px] text-gray-500 truncate">am@vmanous.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
            title="Logout from Admin Panel"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 h-screen transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
