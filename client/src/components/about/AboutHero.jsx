import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <section className="relative min-h-[220px] sm:min-h-[260px] md:min-h-[30vh] flex items-center pt-16 pb-6 md:pt-20 md:pb-10 px-4 sm:px-6 overflow-hidden bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wide text-white mb-2 sm:mb-4 leading-tight"
          >
            Built for the Next Generation of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]">
              AI & Data Science Talent.
            </span>
          </h1>
          <p 
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            className="text-xs sm:text-base md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed line-clamp-3 sm:line-clamp-none"
          >
            VMANOUS is building an ecosystem where colleges, students, mentors and industry come together to create practical, research-driven and future-ready AI and Data Science talent.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
