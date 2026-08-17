import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, onClick }) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-white p-4 rounded-none border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-vmanous-light rounded-none text-vmanous-navy-dark">
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-50 text-vmanous-green' : 'bg-red-50 text-red-600'
          }`}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {trendValue}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-0.5">{title}</h3>
        <p className="text-2xl font-bold text-vmanous-navy-dark">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
