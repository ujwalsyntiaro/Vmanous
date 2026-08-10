import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const WhatIsVmanous = ({ blocks }) => {
  return (
    <section className="py-8 md:py-10 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            More Than Learning.
          </h2>
          <p className="text-lg text-gray-600">
            VMANOUS connects AI and Data Science education with practical projects, research and industry-oriented opportunities.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 -translate-y-1/2" />
          <div className="md:hidden absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-blue-100 via-purple-100 to-green-100" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {blocks.map((block, index) => (
              <motion.div
                key={block.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex md:flex-col items-center gap-6 md:gap-4 pl-16 md:pl-0"
              >
                <div className="absolute left-0 md:relative w-16 h-16 rounded-full bg-white border-2 border-gray-100 shadow-md flex items-center justify-center font-medium text-vmanous-ai-blue group-hover:border-vmanous-ai-blue transition-colors z-10">
                  {block.num}
                </div>
                <div className="md:text-center">
                  <h3 className="text-xl md:text-2xl md: font-medium text-vmanous-navy-deep mb-1 uppercase tracking-wider">{block.title}</h3>
                  <p className="text-sm text-gray-500">{block.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
