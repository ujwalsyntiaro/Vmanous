import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';

export const BlogFeatured = ({ article }) => {
  if (!article) return null;

  return (
    <section className="mb-12">
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
          className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Image Column */}
            <div className="lg:col-span-6 relative min-h-[260px] lg:min-h-[380px]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Content Column */}
            <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between">
              <div>
                {/* Category Pill Tag */}
                <div className="mb-4">
                  <span className="px-3.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl lg:text-3xl font-bold text-vmanous-navy-dark leading-snug mb-4">
                  {article.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8">
                  {article.excerpt}
                </p>
              </div>

              {/* Author & CTA Row */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#050816] text-white flex items-center justify-center text-xs font-bold">
                    {article.authorInitials}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    <span className="font-semibold text-gray-800 mr-3">{article.author}</span>
                    <span className="mr-3">{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div>
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vmanous-green text-white font-semibold text-sm hover:bg-green-700 transition-colors shadow-md shadow-green-500/20">
                    <span>Read Article</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
