import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

const introBlocks = [
  { id: '01', title: 'Learn', desc: 'Understand the foundations of modern AI and Machine Learning.' },
  { id: '02', title: 'Build', desc: 'Apply concepts through practical projects and experiments.' },
  { id: '03', title: 'Research', desc: 'Explore real-world problems through structured experimentation.' },
  { id: '04', title: 'Experience', desc: 'Develop practical exposure and discover future opportunities.' }
];

export const SummitIntro = () => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-vmanous-light">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
              More Than an AI Event
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              VMANOUS AI Summit is designed as a structured journey where students move from understanding AI concepts to building practical solutions, exploring research and developing industry-ready experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {introBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
              >
                <div className="text-sm font-medium text-vmanous-ai-blue mb-4 group-hover:text-purple-500 transition-colors">
                  {block.id}
                </div>
                <h3 className="text-lg md:text-xl font-medium text-vmanous-navy-deep mb-3">{block.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{block.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
