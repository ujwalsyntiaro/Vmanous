import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-white p-3 rounded-lg border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="p-1.5 bg-slate-100 text-slate-700 rounded-md shrink-0">
          <Icon size={16} />
        </div>
        <h3 className="text-xs font-bold text-slate-600 leading-tight">{title}</h3>
      </div>
      <div>
        <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
