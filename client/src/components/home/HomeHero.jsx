import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const HomeHero = ({ data }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    data.image,
    "/images/data-science/hero.jpg",
    "/images/ai-summit/gallery-1.jpg",
    "/images/data-science/gallery-1.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.img 
            key={currentImageIndex}
            src={backgroundImages[currentImageIndex]}
            alt="VMANOUS AI Ecosystem Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/60 via-[#050816]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/40 to-transparent" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-xs font-medium tracking-widest text-vmanous-ai-blue uppercase">
                AI • DATA SCIENCE • INNOVATION
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-medium text-white leading-tight mb-6">
              {data.titleStart} <br className="hidden md:block" />
              {data.titleHighlight} <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-ai-blue to-purple-500">{data.titleEnd}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              {data.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                to="/enroll"
                className="inline-flex justify-center items-center px-8 py-4 bg-vmanous-green text-white font-medium rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-500/25 group"
              >
                Get Started
                <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              
              <Link 
                to="/ai-summit"
                className="inline-flex justify-center items-center px-8 py-4 border border-vmanous-green text-white font-medium rounded-xl hover:bg-vmanous-green transition-all"
              >
                Explore AI Summit
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-white/10">
              {['Learn', 'Build', 'Research', 'Experience'].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-medium text-gray-400 tracking-widest uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-vmanous-ai-blue" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
