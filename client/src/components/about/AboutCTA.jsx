import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutCTA = () => {
  return (
    <section className="bg-white py-24 md:py-32 px-6 border-t border-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-medium text-[#050816] mb-6 tracking-tight">
            Build the Future With AI.
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 mb-12 font-light">
            Learn. Build. Research. Experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/workshops" 
              className="w-full sm:w-auto px-8 py-4 bg-[#16A34A] text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
            >
              Explore Workshops
            </Link>
            <Link 
              to="/ai-summit" 
              className="w-full sm:w-auto px-8 py-4 bg-[#F7F9FC] text-[#050816] border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Explore AI Summit
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCTA;
