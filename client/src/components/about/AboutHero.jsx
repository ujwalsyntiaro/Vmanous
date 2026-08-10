import React from 'react';
import { motion } from 'framer-motion';
import { aboutHero } from '../../constants/about';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';

const AboutHero = () => {
  return (
    <section className="relative bg-[#050816] text-white py-16 md:py-20 overflow-hidden">
      {/* Subtle AI Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#050816] to-[#050816]"></div>
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Container className="relative z-10 w-full flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-6">
            {aboutHero.heading}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            {aboutHero.subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={aboutHero.cta1.link} className="px-8 py-4 bg-vmanous-ai-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30">
              {aboutHero.cta1.text}
            </a>
            <Link to={aboutHero.cta2.link} className="px-8 py-4 bg-white/10 text-white rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm">
              {aboutHero.cta2.text}
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default AboutHero;
