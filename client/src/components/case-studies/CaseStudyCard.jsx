import React from 'react';
import { motion } from 'framer-motion';

export const CaseStudyCard = ({ study }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-10"
    >
      {/* Top Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Image with pill tag */}
        <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[380px] overflow-hidden">
          <img
            src={study.image}
            alt={study.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
          
          {/* Green Image Pill Tag */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="inline-block px-3.5 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold tracking-wide shadow-sm">
              {study.imagePill}
            </span>
          </div>
        </div>

        {/* Right Column: Case Study Info */}
        <div className="lg:col-span-7 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Category uppercase label */}
            <div className="text-xs font-bold tracking-wider text-emerald-600 uppercase mb-2">
              {study.categoryLabel}
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-vmanous-navy-dark leading-snug mb-2">
              {study.title}
            </h2>

            {/* Client info */}
            <p className="text-sm text-gray-500 mb-6 font-medium">
              {study.client}
            </p>

            {/* 3-Column Grid: Challenge, Solution, Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs leading-relaxed">
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
      <div className="border-t border-gray-100 bg-gray-50/50 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200 text-center py-5">
        {study.stats.map((stat, idx) => (
          <div key={idx} className="p-3 flex flex-col justify-center items-center">
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
