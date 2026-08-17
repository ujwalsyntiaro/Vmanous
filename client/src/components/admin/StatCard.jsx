import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-vmanous-light rounded-xl text-vmanous-navy-dark">
          <Icon size={24} />
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
        <h3 className="text-sm font-semibold text-gray-500 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-vmanous-navy-dark">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
