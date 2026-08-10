import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { CheckCircle2 } from 'lucide-react';

export const StudentExperience = ({ experience }) => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-3xl md:text-5xl font-medium text-vmanous-navy-deep mb-6">
            What Students Experience
          </h2>
          <p className="text-lg text-gray-600">
            A comprehensive approach to learning that bridges the gap between academic theory and industry practice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {experience.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-vmanous-light p-6 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-vmanous-ai-blue flex items-center justify-center mb-4">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-xl md:text-2xl md: font-medium text-vmanous-navy-deep mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
