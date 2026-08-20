import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const LearningJourney = ({ steps }) => {
  return (
    <section className="py-8 md:py-10 bg-white relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-4">
            From Learning to Experience
          </h2>
          <p className="text-lg text-gray-600">
            Follow a structured pathway designed to build competence, confidence, and career readiness.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Desktop Line */}
          <div className="hidden md:block absolute top-12 left-10 right-10 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex md:flex-col items-center text-center group"
              >
                <div className="md:hidden w-1 h-12 bg-gray-200 mx-auto -mt-6 mb-2 group-first:hidden" />
                
                <div className="w-24 h-24 rounded-full bg-white border-4 border-gray-100 shadow-xl flex flex-col items-center justify-center relative shrink-0 z-10 mb-6 group-hover:border-vmanous-ai-blue transition-colors duration-300 mx-auto">
                  <span className="text-vmanous-ai-blue font-semibold text-xl">{step.num}</span>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{step.title}</span>
                </div>
                
                <div className="ml-6 md:ml-0 md:text-center mt-2 md:mt-0 flex-1">
                  <h3 className="text-xl md:text-2xl md: font-medium text-vmanous-navy-deep">{step.desc}</h3>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-500 italic max-w-2xl mx-auto">
            * Internship opportunities may be available based on eligibility, performance, evaluation and available opportunities.
          </div>
        </div>
      </Container>
    </section>
  );
};
