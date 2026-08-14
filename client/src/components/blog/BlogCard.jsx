import React from 'react';
import { motion } from 'framer-motion';

export const BlogCard = ({ article, onReadArticle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-none border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Image Container with top-left category badge */}
        <div 
          onClick={onReadArticle}
          className="relative h-48 sm:h-52 overflow-hidden cursor-pointer group"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
              {article.category}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 
            onClick={onReadArticle}
            className="text-lg font-bold text-vmanous-navy-dark leading-snug mb-3 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            {article.title}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-6">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-6 pt-0 border-t border-gray-100 mt-auto flex items-center justify-between pt-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full border border-emerald-500 text-emerald-600 bg-transparent flex items-center justify-center text-[10px] font-bold">
            {article.authorInitials}
          </div>
          <span className="text-xs font-semibold text-gray-700">{article.author}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
          <span>{article.readTime}</span>
          <button
            onClick={onReadArticle}
            className="text-emerald-600 font-semibold hover:underline hover:font-bold transition-all cursor-pointer bg-transparent border-0 p-0"
          >
            Read &rarr;
          </button>
        </div>
      </div>
    </motion.div>
  );
};
