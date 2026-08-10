import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const AISummitHero = ({ data }) => {
  return (
    <section className="relative pt-12 pb-8 md:pt-16 md:pb-10 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 z-0 opacity-70">
        <img
          src={data.images.hero}
          alt="AI Summit Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/80 via-[#050816]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/40 via-transparent to-[#050816]/20" />
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

            <h1 className="text-3xl md:text-4xl font-medium text-white leading-tight mb-4">
              Where Students <br />
              Build With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI.</span>
            </h1>

            <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">
              {data.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex justify-center items-center px-7 py-3 bg-vmanous-ai-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
              >
                Explore the Summit
              </button>

              <button
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex justify-center items-center px-7 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
              >
                View Programs
              </button>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              {['Artificial Intelligence', 'Hands-on Learning', 'Research', 'Innovation'].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-vmanous-green" />
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
