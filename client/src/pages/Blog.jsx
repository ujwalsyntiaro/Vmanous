import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, BookOpen, Clock, User, Share2 } from 'lucide-react';
import {
  blogHeroData,
  featuredArticle,
  blogCategories,
  articlesData
} from '../constants/blog';

import { BlogHero } from '../components/blog/BlogHero';
import { BlogFeatured } from '../components/blog/BlogFeatured';
import { BlogFilter } from '../components/blog/BlogFilter';
import { BlogCard } from '../components/blog/BlogCard';
import Container from '../components/ui/Container';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredArticles = useMemo(() => {
    if (activeCategory === 'All') return articlesData;
    return articlesData.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <BlogHero
        title={blogHeroData.title}
        subtitle={blogHeroData.subtitle}
      />

      {/* Featured Article Section */}
      <BlogFeatured 
        article={featuredArticle} 
        onReadArticle={() => setSelectedArticle(featuredArticle)}
      />

      {/* Category Filter Pills & Article Grid */}
      <section className="pb-6 sm:pb-12">
        <BlogFilter
          categories={blogCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredArticles.map((article) => (
              <BlogCard 
                key={article.id} 
                article={article} 
                onReadArticle={() => setSelectedArticle(article)}
              />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
              <p className="text-gray-500 text-base">
                No articles found for "{activeCategory}".
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Bottom CTA / Newsletter Section */}
      <section className="py-8 sm:py-14 md:py-16 bg-[#050816] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-vmanous-green/10 rounded-full blur-[140px]" />
        </div>

        <Container className="relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
              Stay Ahead in AI & Analytics
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
              Explore practical engineering insights, Power BI frameworks, and real-world Data Science methodologies delivered by VMANOUS.
            </p>
            <Link
              to="/enroll"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-emerald-500 text-emerald-400 bg-transparent text-sm font-semibold hover:font-bold hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200 cursor-pointer group"
            >
              <span>Explore Programs & Workshops</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-colors border border-white/20 shadow-lg cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Banner Image */}
              <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-md bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    {selectedArticle.category}
                  </span>
                  <span className="text-xs font-semibold text-gray-200 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {selectedArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Author Info */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-full border-2 border-emerald-500 text-emerald-600 bg-emerald-50 flex items-center justify-center text-sm font-bold">
                    {selectedArticle.authorInitials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{selectedArticle.author}</h4>
                    <p className="text-xs text-gray-500">{selectedArticle.date || 'Published Recently'} • VMANOUS Insights</p>
                  </div>
                </div>

                {/* Article Title & Lead Excerpt */}
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-slate-900 leading-snug mb-3">
                    {selectedArticle.title}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-500">
                    {selectedArticle.excerpt}
                  </p>
                </div>

                {/* Main Detailed Content Body */}
                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-2">
                    Executive Overview & Key Insights
                  </h3>
                  <p>
                    Modern Data & Artificial Intelligence architectures require continuous evaluation of production data pipelines, analytical modeling, and secure dashboard governance. At VMANOUS, our engineering mentors and industry practitioners focus on bridging theoretical knowledge with high-impact enterprise deployments.
                  </p>
                  <p>
                    Whether implementing granular Row-Level Security (RLS) policies in Power BI or developing distributed machine learning algorithms, key architectural patterns enable scalable analytics across cross-functional teams.
                  </p>

                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                    <div className="text-emerald-400 font-bold mb-1">// DAX & Data Architecture Pattern</div>
                    <code>
                      EVALUATE <br />
                      CALCULATETABLE(<br />
                      &nbsp;&nbsp;VALUES('Sales'[Region]),<br />
                      &nbsp;&nbsp;'UserPermissions'[UserEmail] = USERPRINCIPALNAME()<br />
                      )
                    </code>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-2">
                    Practical Implementation Steps
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Define granular role definitions based on organizational security requirements.</li>
                    <li>Validate live data models against edge cases and dynamic security filter contexts.</li>
                    <li>Automate CI/CD pipeline deployments to ensure continuous compliance and zero-downtime metric dashboards.</li>
                  </ul>
                </div>

                {/* Footer Action Bar */}
                <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-transparent text-xs font-semibold hover:font-bold hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                  >
                    Close Article
                  </button>

                  <Link
                    to="/enroll"
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2.5 rounded-lg border border-emerald-500 text-emerald-600 bg-transparent text-xs font-semibold hover:font-bold hover:bg-emerald-50/80 hover:border-emerald-600 inline-flex items-center gap-2 transition-all duration-200 cursor-pointer group"
                  >
                    <span>Explore AI & Data Science Programs</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
