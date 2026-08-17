import React from 'react';
import { motion } from 'framer-motion';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="w-16 h-16 bg-vmanous-light text-vmanous-navy-dark rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-vmanous-navy-dark mb-3">
          {title}
        </h2>
        <p className="text-gray-500 mb-6">
          This module is currently under development. The foundation has been laid, and full functionality will be available in a future update.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-vmanous-light text-vmanous-navy-dark hover:bg-gray-200 font-medium rounded-xl transition-colors"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
};

export default PlaceholderPage;
