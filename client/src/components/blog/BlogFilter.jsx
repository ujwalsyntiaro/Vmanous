import React from 'react';
import Container from '../ui/Container';

export const BlogFilter = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <section className="mb-10">
      <Container>
        <div className="flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-md'
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
