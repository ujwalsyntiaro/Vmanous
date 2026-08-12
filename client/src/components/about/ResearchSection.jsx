import React from 'react';
import { motion } from 'framer-motion';

const ResearchSection = () => {
  return (
    <section className="bg-[#050816] text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#7C3AED]/20 to-transparent rounded-full blur-3xl opacity-50 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[450px] lg:min-h-[520px]">
        {/* Left Side: 50% Full-bleed Image (Original Color, Full Opacity) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-auto min-h-full overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
            alt="Indian AI Researchers working together"
            className="w-full h-full object-cover opacity-100"
          />
        </motion.div>

        {/* Right Side: 50% Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 py-12 lg:py-16 relative z-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Research That Turns Ideas Into Possibilities
          </h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
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
                className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium backdrop-blur-sm hover:border-vmanous-green/50 transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResearchSection;
