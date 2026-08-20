import React from 'react';
import { motion } from 'framer-motion';

export const CaseStudyCard = ({ study }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-md sm:rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Top Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Image with pill tag */}
        <div className="lg:col-span-5 relative h-52 sm:h-auto min-h-0 sm:min-h-[280px] lg:min-h-[380px] rounded-md sm:rounded-lg overflow-hidden">
          <img
            src={study.image}
            alt={study.title}
            className="w-full h-full object-cover rounded-md sm:rounded-lg"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

          {/* White Text Only */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10">
            <span className="text-white text-xs sm:text-sm font-semibold tracking-wide drop-shadow-md">
              {study.imagePill}
            </span>
          </div>
        </div>

        {/* Right Column: Case Study Info */}
        <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Category uppercase label */}
            <div className="text-[11px] sm:text-xs font-bold tracking-wider text-emerald-600 uppercase mb-1 sm:mb-2">
              {study.categoryLabel}
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-vmanous-navy-dark leading-snug mb-1 sm:mb-2">
              {study.title}
            </h2>

            {/* Client info */}
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 font-medium">
              {study.client}
            </p>

            {/* 3-Column Grid: Challenge, Solution, Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-5 sm:mb-8 text-xs leading-relaxed">
              {/* CHALLENGE */}
              <div>
                <h4 className="font-bold text-gray-700 tracking-wider uppercase mb-2">
                  CHALLENGE
                </h4>
                <p className="text-gray-500">{study.challenge}</p>
              </div>

              {/* SOLUTION */}
              <div>
                <h4 className="font-bold text-gray-700 tracking-wider uppercase mb-2">
                  SOLUTION
                </h4>
                <p className="text-gray-500">{study.solution}</p>
              </div>

              {/* RESULT */}
              <div>
                <h4 className="font-bold text-gray-700 tracking-wider uppercase mb-2">
                  RESULT
                </h4>
                <p className="text-gray-600 font-semibold">{study.result}</p>
              </div>
            </div>
          </div>

          {/* Tech Badges Row */}
          <div className="flex flex-wrap gap-2 pt-2">
            {study.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats Strip */}
      <div className="border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200 text-center py-2.5 sm:py-3">
        {study.stats.map((stat, idx) => (
          <div key={idx} className="p-1.5 sm:p-2 flex flex-col justify-center items-center">
            <div className="text-2xl md:text-3xl font-semibold text-vmanous-green mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
