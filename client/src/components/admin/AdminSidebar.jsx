import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../ui/Logo';
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
  X
} from 'lucide-react';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navigation = [
    { title: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    {
      title: 'Management',
      items: [
        { name: 'Students', path: '/admin/students', icon: Users },
        { name: 'Colleges', path: '/admin/colleges', icon: Building2 },
        { name: 'Trainers', path: '/admin/trainers', icon: GraduationCap },
        { name: 'Organizations', path: '/admin/organizations', icon: Briefcase },
      ]
    },
    {
      title: 'Programs',
      items: [
        { name: 'AI Summits', path: '/admin/ai-summits', icon: Calendar },
        { name: 'Workshops', path: '/admin/workshops', icon: Users },
        { name: 'Data Science', path: '/admin/data-science', icon: BarChart3 },
        { name: 'Internships', path: '/admin/internships', icon: Briefcase },
      ]
    },
    {
      title: 'Enrollment',
      items: [
        { name: 'Applications', path: '/admin/applications', icon: FileText },
        { name: 'Enrollments', path: '/admin/enrollments', icon: Users },
        { name: 'Attendance', path: '/admin/attendance', icon: Calendar },
      ]
    },
    {
      title: 'Research',
      items: [
        { name: 'R&D Projects', path: '/admin/rd-projects', icon: Microscope },
      ]
    },
    {
      title: 'Evaluation',
      items: [
        { name: 'Assessments', path: '/admin/assessments', icon: FileText },
        { name: 'Evaluations', path: '/admin/evaluations', icon: Award },
      ]
    },
    {
      title: 'Certificates',
      items: [
        { name: 'Manage Certificates', path: '/admin/certificates', icon: Award },
      ]
    },
    {
      title: 'Platform',
      items: [
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Announcements', path: '/admin/announcements', icon: Mail },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-gray-900 border-r border-gray-200">
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between">
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

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="px-4 space-y-8">

          {/* Dashboard Main Link */}
          <div>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsMobileOpen(false)}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </div>

          {/* Navigation Categories */}
          {navigation.filter(group => group.items).map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`
                      }
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon size={18} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@vmanous.com</p>
          </div>
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
