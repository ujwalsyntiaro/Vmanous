import React from 'react';
import Container from '../ui/Container';

export const CaseStudiesFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <section className="mb-4 sm:mb-8">
      <Container>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg text-[11px] sm:text-sm font-medium transition-all duration-200 border whitespace-nowrap ${isActive
                    ? 'bg-emerald-50/80 text-[#16A34A] border-2 border-[#16A34A] font-bold shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#16A34A] hover:text-[#16A34A] hover:bg-gray-50'
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
