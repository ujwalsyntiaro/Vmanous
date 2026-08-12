import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const AISummitHero = ({ data }) => {
  return (
    <section className="relative h-[220px] sm:h-[280px] md:min-h-[46vh] flex items-end pt-12 pb-3 md:pt-24 md:pb-10 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 z-0 opacity-90">
        <img
          src={data.images.hero}
          alt="AI Summit Hero"
          className="w-full h-full object-cover object-[center_20%] md:object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/80 via-[#050816]/40 to-[#050816]/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 py-2 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 tracking-wide whitespace-nowrap"
            >
              Where Students Build With AI
            </h1>

            <p
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="text-base md:text-lg text-gray-300 leading-snug max-w-2xl"
            >
              {data.description}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-shrink-0 self-start md:self-end"
        >
          <Link
            to="/enroll"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full text-sm sm:text-base font-medium text-white border border-white/40 bg-transparent hover:bg-transparent hover:border-vmanous-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transform hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer whitespace-nowrap"
          >
            <span>Enroll Now</span>

          </Link>
        </motion.div>
      </div>
    </section>
  );
};
