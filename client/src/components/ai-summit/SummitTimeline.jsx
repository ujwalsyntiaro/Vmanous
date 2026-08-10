import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const SummitTimeline = ({ timeline }) => {
  return (
    <section id="timeline" className="py-6 md:py-8 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-3xl md:text-5xl font-medium text-vmanous-navy-deep mb-6">
            Your AI Summit Journey
          </h2>
          <p className="text-lg text-gray-600">
            A structured path from core concepts to practical application and potential career opportunities.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Desktop Horizontal */}
          <div className="hidden md:flex flex-col space-y-4 relative">
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-200 to-purple-200" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-8 relative z-10"
              >
                <div className="w-16 h-16 shrink-0 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center font-medium text-vmanous-ai-blue text-sm ring-2 ring-blue-100">
                  {item.day || <span className="text-purple-500 text-xs text-center leading-tight">Phase</span>}
                </div>
                
                <div className={`flex-grow p-6 rounded-2xl border ${item.phase ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-purple-100' : 'bg-white border-gray-200'} shadow-sm`}>
                  <div className="font-medium text-vmanous-navy-deep text-lg">
                    {item.topic || item.phase}
                  </div>
                  {item.duration && (
                    <div className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">
                      {item.duration}
                    </div>
                  )}
                  {item.phase === 'INTERNSHIP PATHWAY' && (
                    <div className="text-xs text-gray-500 italic mt-2">
                      * Opportunities depend on eligibility, performance, evaluation and available opportunities.
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Vertical */}
          <div className="md:hidden flex flex-col space-y-6 relative pl-6">
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-blue-200 to-purple-200" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[35px] top-4 w-4 h-4 rounded-full bg-vmanous-ai-blue border-2 border-white shadow-sm" />
                
                <div className={`p-5 rounded-xl border ${item.phase ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-purple-100' : 'bg-white border-gray-100'} shadow-sm`}>
                  <div className="text-xs font-medium text-vmanous-ai-blue mb-1">
                    {item.day || item.duration}
                  </div>
                  <div className="font-medium text-vmanous-navy-deep">
                    {item.topic || item.phase}
                  </div>
                  {item.phase === 'INTERNSHIP PATHWAY' && (
                    <div className="text-xs text-gray-500 italic mt-2 leading-tight">
                      * Opportunities depend on eligibility, performance, evaluation and available opportunities.
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
