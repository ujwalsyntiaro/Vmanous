import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const AISummitHero = ({ data }) => {
  return (
    <section className="relative min-h-[50vh] md:min-h-[62vh] flex items-end pt-24 pb-8 md:pt-32 md:pb-10 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 z-0 opacity-90">
        <img
          src={data.images.hero}
          alt="AI Summit Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/60 via-[#050816]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/20 via-transparent to-[#050816]/10" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-vmanous-light">VMANOUS AI SUMMIT 2026</span>
            </div>

            <h1 
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 tracking-wide"
            >
              Where Students <br />
              Build With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI.</span>
            </h1>

            <p 
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="text-base md:text-lg text-gray-300 leading-relaxed"
            >
              {data.description}
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
