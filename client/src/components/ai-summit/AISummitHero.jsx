import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const AISummitHero = ({ data }) => {
  return (
    <section className="relative min-h-[35vh] md:min-h-[40vh] flex items-end pt-16 pb-0 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 z-0 opacity-90">
        <img
          src={data.images.hero}
          alt="AI Summit Hero"
          className="w-full h-full object-cover object-[center_20%] md:object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/50 via-[#050816]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full pr-4 sm:pr-6 md:pr-10 lg:pr-16">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-2 tracking-wide whitespace-nowrap"
            >
              Where Students Build With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">AI.</span>
            </h1>

            <p
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="text-base md:text-lg text-gray-300 leading-snug"
            >
              {data.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
