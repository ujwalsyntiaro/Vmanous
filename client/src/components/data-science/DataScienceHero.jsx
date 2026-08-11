import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { ArrowRight, ChevronDown } from 'lucide-react';

const DataScienceHero = () => {
  return (
    <section className="relative pt-8 pb-6 md:pt-12 md:pb-8 overflow-hidden bg-[#050816]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-vmanous-ai-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-vmanous-ai-blue animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-vmanous-light">VMANOUS DATA SCIENCE</span>
            </div>
            
            <h1 
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 tracking-wide"
            >
              Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-ai-blue to-purple-400">Data</span> Into <br className="hidden md:block" />
              Meaningful Intelligence.
            </h1>
            
            <p 
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="text-sm md:text-base text-gray-400 mb-5 leading-relaxed max-w-xl"
            >
              Explore the tools, technologies and practical experiences that power modern Data Science — from data preparation and visualization to machine learning and AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to="/enroll" 
                className="inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-vmanous-ai-blue text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-vmanous-ai-blue/25"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
              
              <button 
                onClick={() => {
                  const element = document.getElementById('learning-path');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-white/5 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
              >
                Explore Learning Path
                <ChevronDown size={16} />
              </button>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[250px] lg:h-[340px] rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-vmanous-ai-blue/20 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent z-10" />
            <img 
              src="/images/data-science/hero.jpg" 
              alt="Data Science Hub" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay UI elements */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-vmanous-ai-blue/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-vmanous-ai-blue animate-pulse" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-medium">Model Accuracy</div>
                    <div className="text-xs text-green-400">+94.2% Optimization</div>
                  </div>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-vmanous-ai-blue to-purple-500 w-[94%]" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};

export default DataScienceHero;
