import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const TechnologyUniverse = ({ technologies }) => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Artificial Intelligence', 'Machine Learning', 'Generative AI', 'Data Science', 'Computer Vision', 'NLP', 'AI Automation', 'Analytics'];
  
  // A clean layout of major tools
  const tools = technologies;

  return (
    <section className="py-8 md:py-10 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            Explore the Technologies Shaping AI
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get hands-on experience with the tools that power the modern data and AI landscape.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-vmanous-ai-blue text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {tools.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`bg-white border p-6 rounded-xl text-center shadow-xs hover:shadow-md transition-all ${filter === 'All' || filter === tech.category ? 'border-gray-200 opacity-100 hover:border-blue-300' : 'border-gray-100 opacity-30 grayscale'}`}
            >
              <div className="font-medium text-vmanous-navy-deep">{tech.name}</div>
              <div className="text-[10px] font-medium text-vmanous-ai-blue mt-2 uppercase tracking-widest">{tech.category}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
