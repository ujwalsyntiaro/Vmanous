import React from 'react';
import { Users, Building2, BookOpen, Calendar, Briefcase, FileText } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import EventCard from '../../components/admin/EventCard';
import { getSummits } from '../../services/summitService';

const DashboardHome = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-vmanous-navy-dark">
          Good morning, Admin
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening across VMANOUS today.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard 
          title="Total Students" 
          value="1,248" 
          icon={Users} 
          trend="up" 
          trendValue="+12% this month" 
        />
        <StatCard 
          title="Partner Colleges" 
          value="45" 
          icon={Building2} 
          trend="up" 
          trendValue="+3 this month" 
        />
        <StatCard 
          title="Active Programs" 
          value="12" 
          icon={BookOpen} 
          trend="up" 
          trendValue="+2 this month" 
        />
        <StatCard 
          title="Upcoming AI Summits" 
          value="3" 
          icon={Calendar} 
        />
        <StatCard 
          title="Internship Candidates" 
          value="342" 
          icon={Briefcase} 
          trend="down" 
          trendValue="-5% this month" 
        />
        <StatCard 
          title="Pending Applications" 
          value="89" 
          icon={FileText} 
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - Analytics & Charts Placeholder */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-vmanous-navy-dark">Platform Analytics</h3>
              <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none text-gray-600">
                <option>Last 30 Days</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
            {/* Chart Placeholder */}
            <div className="h-72 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
              <BarChart3 size={32} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">Chart Visualization Area</p>
              <p className="text-xs text-gray-400 mt-1">Ready for integration with Recharts/Chart.js</p>
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Events */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-lg font-bold text-vmanous-navy-dark">Upcoming Events</h3>
            <button className="text-sm font-semibold text-vmanous-ai-blue hover:underline">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            {getSummits().slice(0, 3).map((summit) => (
              <EventCard 
                key={summit.id}
                title={summit.title}
                type={summit.type}
                date={summit.date}
                time={summit.duration}
                location={summit.college}
                status="Upcoming"
                registrations={0}
              />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

// Quick placeholder icon for the chart since it wasn't imported from lucide-react at the top
const BarChart3 = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

export default DashboardHome;
