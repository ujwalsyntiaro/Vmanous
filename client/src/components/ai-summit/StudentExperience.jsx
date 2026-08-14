import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { CheckCircle2 } from 'lucide-react';

export const StudentExperience = ({ experience }) => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-4 md:mb-6">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-2 sm:mb-3">
            What Students Experience
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            A comprehensive approach to learning that bridges the gap between academic theory and industry practice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {experience.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-vmanous-light p-4 sm:p-5 md:p-6 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-vmanous-ai-blue flex items-center justify-center mb-3">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="text-base md:text-lg font-medium text-vmanous-navy-deep mb-1.5">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
