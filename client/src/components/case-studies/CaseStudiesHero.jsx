import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const CaseStudiesHero = ({ title, subtitle }) => {
  return (
    <section className="relative min-h-[220px] sm:min-h-[260px] md:min-h-[30vh] flex items-center pt-16 pb-6 md:pt-16 md:pb-24 overflow-hidden bg-[#050816]">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/network.jpg"
          alt="Case Studies Background"
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-[#050816]/60 to-[#050816]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-vmanous-ai-blue/20 rounded-full blur-[140px]" />
      </div>

      <Container className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl text-white tracking-wide mb-2 sm:mb-4 leading-tight"
          >
            {title}
          </h1>
          <p 
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            className="text-xs sm:text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed line-clamp-3 sm:line-clamp-none"
          >
            {subtitle}
          </p>
        </motion.div>
      </Container>
    </section>
  );
};
