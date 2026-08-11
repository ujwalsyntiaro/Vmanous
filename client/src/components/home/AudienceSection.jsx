import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const AudienceSection = ({ audiences }) => {
  return (
    <section className="pt-0 pb-6 md:pb-8 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-4">
            Built for Students Who Want to Build More.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-6 py-4 bg-white border border-gray-200 rounded-full shadow-sm text-vmanous-navy-deep font-medium"
            >
              {audience}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
