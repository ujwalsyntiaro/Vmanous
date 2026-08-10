import React, { useState, useEffect, useMemo } from 'react';
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
      <BlogFeatured article={featuredArticle} />

      {/* Category Filter Pills & Article Grid */}
      <section className="pb-20">
        <BlogFilter
          categories={blogCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <BlogCard key={article.id} article={article} />
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
      <section className="py-16 md:py-20 bg-[#050816] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-vmanous-green/10 rounded-full blur-[140px]" />
        </div>

        <Container className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto border border-white/10 bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Stay Ahead with Enterprise AI & Power BI Insights
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-8 max-w-xl mx-auto font-light leading-relaxed">
              Explore practical frameworks, deep-dive tutorials, and real-world project blueprints written by practitioners.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/enroll"
                className="px-8 py-3.5 bg-vmanous-green text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/25 text-sm"
              >
                Enroll in VMANOUS
              </Link>
              <Link
                to="/case-studies"
                className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-sm backdrop-blur-sm"
              >
                Explore Case Studies
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Blog;
