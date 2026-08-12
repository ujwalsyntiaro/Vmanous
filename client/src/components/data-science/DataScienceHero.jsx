import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

const DataScienceHero = () => {
  return (
    <section className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[40vh] flex items-center pt-16 pb-6 md:pt-24 md:pb-12 overflow-hidden bg-[#050816] text-white">
      {/* Background Image & Dark Theme Overlays (Gallery Style) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/images/data-science/hero.jpg"
          alt="Data Science Background"
          className="w-full h-full object-cover opacity-25 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/90 via-[#050816]/75 to-[#050816]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-transparent to-[#050816]" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-vmanous-ai-blue/20 rounded-full blur-[140px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2 sm:mb-4 backdrop-blur-md">
            <Sparkles size={13} className="text-vmanous-ai-blue animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-vmanous-light">VMANOUS DATA SCIENCE</span>
          </div>

          <h1
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-2 sm:mb-4 tracking-wide"
          >
            Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-ai-blue via-teal-400 to-purple-400">Data</span> Into <br className="hidden sm:block" />
            Meaningful Intelligence.
          </h1>

          <p
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            className="text-xs sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-8 leading-relaxed max-w-2xl line-clamp-3 sm:line-clamp-none"
          >
            Explore the tools, technologies and practical experiences that power modern Data Science — from data preparation and visualization to machine learning and AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/enroll"
              className="inline-flex justify-center items-center gap-2 px-7 py-3 bg-vmanous-ai-blue text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-vmanous-ai-blue/25"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={() => {
                const element = document.getElementById('learning-path');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex justify-center items-center gap-2 px-7 py-3 bg-white/5 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
            >
              Explore Learning Path
              <ChevronDown size={16} />
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default DataScienceHero;
