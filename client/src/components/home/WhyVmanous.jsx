import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const WhyVmanous = ({ benefits }) => {
  return (
    <section className="py-8 md:py-10 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl md: text-xl md:text-xl font-medium text-vmanous-navy-deep mb-6">
            Why VMANOUS?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-vmanous-light p-8 rounded-2xl border border-gray-100"
            >
              <h3 className="text-xl md:text-2xl md: text-xl font-medium text-vmanous-navy-deep mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
