import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const AITechnologyShowcase = ({ technologies }) => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(technologies.map(t => t.category))];
  
  const filteredTech = filter === 'All' 
    ? technologies 
    : technologies.filter(t => t.category === filter);

  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            Technologies You Can Explore
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Discover the diverse tools and frameworks that power modern AI solutions.
          </p>
          <p className="text-sm text-gray-400 italic">
            * Technology areas may include...
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === category
                  ? 'bg-vmanous-ai-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {filteredTech.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center flex-grow sm:flex-grow-0 min-w-[140px]"
            >
              <div className="font-medium text-vmanous-navy-deep">{tech.name}</div>
              <div className="text-xs text-vmanous-ai-blue mt-1 uppercase tracking-wider">{tech.category}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
