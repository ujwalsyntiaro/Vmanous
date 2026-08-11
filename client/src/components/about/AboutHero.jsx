import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <section className="bg-[#050816] text-white pt-32 pb-20 md:pt-40 md:pb-32 px-6">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-[#2563EB] font-bold tracking-[0.2em] text-xs uppercase mb-6 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10">
            About Vmanous
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-8 leading-[1.1]">
            Built for the Next Generation of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#7C3AED]">
              AI & Data Science Talent.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            VMANOUS is building an ecosystem where colleges, students, mentors and industry come together to create practical, research-driven and future-ready AI and Data Science talent.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
