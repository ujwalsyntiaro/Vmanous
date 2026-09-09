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

      <div className="relative z-10 w-full px-4 sm:px-10 md:px-14 lg:px-20 py-2 flex flex-row items-center md:items-end justify-between gap-3 sm:gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-lg sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-0 sm:mb-3 tracking-wide"
            >
              Where Students Build With AI
            </h1>

            <p
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="hidden sm:block text-base md:text-lg text-gray-300 leading-snug max-w-2xl"
            >
              {data.description}
            </p>
          </motion.div>
        </div>

        <div className="flex-shrink-0 ml-auto">
          <Link
            to="/enroll"
            className="relative inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold text-white border border-white/70 bg-white/10 backdrop-blur-md overflow-hidden group cursor-pointer whitespace-nowrap shadow-sm hover:border-[rgb(69_191_100)] transition-colors duration-300"
          >
            {/* Bottom-to-Top Green Fill Animation Layer */}
            <span
              className="absolute inset-0 bg-[rgb(69_191_100)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
              aria-hidden="true"
            />

            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-2">
              Enroll Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

