import React from 'react';
import { motion } from 'framer-motion';

const ResearchSection = () => {
  return (
    <section className="bg-[#050816] text-white py-6 md:py-8 px-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#7C3AED]/20 to-transparent rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-[#7C3AED]/20 to-transparent rounded-[32px] transform -translate-x-4 translate-y-4 -z-10" />
            <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] relative bg-[#080B1A]">
              {/* Note: Placeholder image representing Indian researchers. */}
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" 
                alt="Indian AI Researchers working together" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500 mix-blend-luminosity hover:mix-blend-normal"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 leading-tight">
              Research That Turns Ideas Into Possibilities
            </h2>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              VMANOUS encourages students to move beyond foundational learning and explore the frontiers of technology through active research and development.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {[
                "AI Research",
                "Machine Learning",
                "Generative AI",
                "Data Science",
                "Computer Vision",
                "NLP",
                "AI Automation"
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
