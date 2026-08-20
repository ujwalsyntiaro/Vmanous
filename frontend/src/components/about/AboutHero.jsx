import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AboutHero = () => {
  return (
    <section className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[36vh] flex items-center pt-16 pb-10 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 px-4 sm:px-6 overflow-hidden bg-[#040D1A] text-white">
      {/* Background Image Overlay (White & Green AI Neural Theme) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/about-hero-bg.svg"
          alt="AI White and Green Neural Network Background"
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040D1A]/85 via-[#040D1A]/60 to-[#040D1A]/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040D1A]/70 via-transparent to-[#040D1A]" />
      </div>

      <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <h1 
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl tracking-wide text-white mb-3 sm:mb-5 leading-tight"
          >
            Built for the Next Generation of <br className="hidden md:block" />
            AI & Data Science Talent.
          </h1>

          <p 
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            className="hidden sm:block text-xs sm:text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            VMANOUS is building an ecosystem where colleges, students, mentors and industry come together to create practical, research-driven and future-ready AI and Data Science talent.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
