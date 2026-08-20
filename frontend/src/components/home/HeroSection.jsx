import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';

const HeroSection = () => {
  const heroImages = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  ];

  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Slides every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-vmanous-navy-dark">
      
      {/* Full-width Background Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImgIdx}
            src={heroImages[currentImgIdx]} 
            alt="VMANOUS AI and Data Science" 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Dark Overlays for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-vmanous-navy-dark/95 via-vmanous-navy-dark/70 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-vmanous-navy-dark/40 z-10"></div>
      </div>

      <Container className="relative z-20 w-full">
        <div className="max-w-3xl flex flex-col items-start">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-vmanous-ai-blue/20 text-white text-xs md:text-sm font-semibold mb-8 border border-vmanous-ai-blue/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-vmanous-ai-blue mr-2 animate-pulse"></span>
              AI & DATA SCIENCE ECOSYSTEM
            </div>
            
            <h1 className="text-3xl md:text-5xl md: text-xl sm: lg:text-xl font-medium leading-tight text-white mb-8">
              Build the Skills.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-ai-electric to-vmanous-ai-purple">
                Shape the Future with AI.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              VMANOUS connects colleges, students and industry through practical AI & Data Science workshops, research programs and internship opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 bg-vmanous-green text-white font-medium rounded-xl hover:bg-vmanous-green-hover hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-vmanous-green/20 outline-none focus-visible:ring-2 focus-visible:ring-vmanous-green focus-visible:ring-offset-2">
                Explore Workshops
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white">
                For Colleges
              </button>
            </div>
            
            <p className="text-sm text-gray-400 mt-8 font-medium">
              Industry-focused learning &bull; Practical projects &bull; Internship opportunities
            </p>
          </motion.div>
          
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
