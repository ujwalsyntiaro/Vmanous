import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

const pipeline = ['Problem', 'Research', 'Hypothesis', 'Experiment', 'Analysis', 'Prototype', 'Evaluation'];

export const ResearchInnovation = ({ researchAreas }) => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-[#050816] relative overflow-hidden">
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-3xl md:text-5xl font-medium text-white mb-6">
            From Learning to Research
          </h2>
          <p className="text-lg text-gray-400">
            Students can explore how AI is applied to real-world problems through structured experimentation and research-oriented activities.
          </p>
        </div>

        {/* Research Pipeline */}
        <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex items-center min-w-max px-4">
            {pipeline.map((step, index) => (
              <React.Fragment key={step}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium backdrop-blur-sm"
                >
                  {step}
                </motion.div>
                {index < pipeline.length - 1 && (
                  <div className="w-12 h-px bg-gradient-to-r from-white/20 to-transparent mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Research Areas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {researchAreas.map((area, index) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 text-center border border-white/10 rounded-xl bg-gradient-to-b from-white/5 to-transparent text-gray-300 hover:text-white hover:border-white/30 transition-all"
            >
              {area}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
