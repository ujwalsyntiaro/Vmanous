import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <section className="bg-[#050816] text-white pt-5 pb-12 md:pt-7 md:pb-16 px-6">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
            className="text-3xl md:text-5xl lg:text-6xl tracking-wide text-white mb-6 leading-[1.1]"
          >
            Built for the Next Generation of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]">
              AI & Data Science Talent.
            </span>
          </h1>
          <p 
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            VMANOUS is building an ecosystem where colleges, students, mentors and industry come together to create practical, research-driven and future-ready AI and Data Science talent.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
