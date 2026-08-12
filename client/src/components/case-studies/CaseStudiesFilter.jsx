import React from 'react';
import Container from '../ui/Container';

export const CaseStudiesFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <section className="mb-10">
      <Container>
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-white text-[#0f172a] border-[#0f172a] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
