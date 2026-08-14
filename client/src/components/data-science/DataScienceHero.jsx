import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

const DataScienceHero = () => {
  return (
    <section className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[40vh] flex items-end pt-12 pb-3 md:pt-24 md:pb-10 overflow-hidden bg-[#050816] text-white">
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
          <h1
            style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-5 sm:mb-6 tracking-wide"
          >
            Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-ai-blue via-teal-400 to-purple-400">Data</span> Into <br className="hidden sm:block" />
            Meaningful Intelligence.
          </h1>

          <p
            style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
            className="hidden sm:block text-xs sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-8 leading-relaxed max-w-2xl"
          >
            Explore the tools, technologies and practical experiences that power modern Data Science — from data preparation and visualization to machine learning and AI.
          </p>

          <div className="flex flex-row items-center gap-2.5 sm:gap-4 w-full">
            <Link
              to="/enroll"
              className="inline-flex justify-center items-center gap-1.5 px-4 py-2.5 sm:px-7 sm:py-3 border border-emerald-500 text-white bg-transparent hover:border-emerald-400 transition-all text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap flex-1 sm:flex-none cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={() => {
                const element = document.getElementById('learning-path');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex justify-center items-center gap-1.5 px-4 py-2.5 sm:px-7 sm:py-3 bg-white/10 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md whitespace-nowrap flex-1 sm:flex-none cursor-pointer"
            >
              <span>Learning Path</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default DataScienceHero;
