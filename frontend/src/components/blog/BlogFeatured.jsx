import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';

export const BlogFeatured = ({ article, onReadArticle }) => {
  if (!article) return null;

  const highlights = [
    "Dynamic RLS & USERNAME()",
    "DAX Role Hierarchies",
    "Role-Based Access Control",
    "Enterprise Security Audit"
  ];

  return (
    <section className="pt-6 sm:pt-8 mb-12">
      <Container>
        {/* Label above */}
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4">
          FEATURED ARTICLE
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Image Column */}
            <div className="lg:col-span-6 relative h-[220px] sm:h-[260px] lg:h-full lg:min-h-[380px] rounded-md sm:rounded-lg overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover rounded-md sm:rounded-lg"
              />
            </div>

            {/* Right Content Column - Top-aligned with image top edge */}
            <div className="lg:col-span-6 pt-5 pb-8 px-6 sm:px-8 lg:pt-6 lg:pb-10 lg:px-12 flex flex-col justify-between">
              <div>
                {/* Category Pill Tag - Starts at top edge */}
                <div className="mb-4">
                  <span className="px-3.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h2 
                  onClick={onReadArticle}
                  className="text-2xl lg:text-3xl font-bold text-vmanous-navy-dark leading-snug mb-4 cursor-pointer hover:text-emerald-600 transition-colors"
                >
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
                  {article.excerpt}
                </p>

                {/* Key Highlights Data in Middle Space */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                  {highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-200/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Author & CTA Row */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-2 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-emerald-500 text-emerald-600 bg-transparent flex items-center justify-center text-xs font-bold">
                    {article.authorInitials}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    <span className="font-semibold text-gray-800 mr-3">{article.author}</span>
                    <span className="mr-3">{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <button 
                  onClick={onReadArticle}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-emerald-500 text-emerald-600 bg-transparent text-sm font-semibold hover:font-bold hover:bg-emerald-50/80 hover:border-emerald-600 transition-all duration-200 cursor-pointer ml-auto group"
                >
                  <span>Read Article</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
