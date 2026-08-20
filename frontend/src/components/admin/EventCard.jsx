import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const EventCard = ({ title, type, date, time, location, registrations, status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'active': return 'bg-green-50 text-vmanous-green border-green-200';
      case 'completed': return 'bg-gray-50 text-gray-600 border-gray-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-vmanous-ai-blue bg-blue-50 px-2 py-1 rounded-md">
            {type}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        <h4 className="text-lg font-bold text-vmanous-navy-dark mb-3">{title}</h4>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-4 sm:gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-gray-400" />
          <span className="font-semibold text-vmanous-navy-dark">{registrations}</span>
          <span className="text-gray-500 text-xs">Registered</span>
        </div>
        <button className="text-sm font-semibold text-vmanous-ai-electric hover:text-vmanous-ai-blue transition-colors px-4 py-2 border border-blue-100 rounded-lg hover:bg-blue-50">
          Manage Event
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
