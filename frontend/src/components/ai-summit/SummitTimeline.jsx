import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export const SummitTimeline = ({ timeline }) => {
  return (
    <section id="timeline" className="py-6 md:py-8 bg-white overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-3">
            Your AI Summit Journey
          </h2>
          <p className="text-base text-gray-600">
            A structured path from core concepts to practical application and potential career opportunities.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative px-2">
          {/* Desktop Center Line Zig-Zag Layout */}
          <div className="hidden md:block relative z-10">
            {/* Center Line */}
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-400 via-purple-400 to-green-500 z-0" />

            <div className="space-y-3 relative z-10">
              {timeline.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className={`flex items-center w-full ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Card Half */}
                    <div className="w-[45%]">
                      <div className={`flex items-center gap-3 bg-white p-2.5 md:p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#16A34A]/40 transition-all duration-300 group ${isEven ? 'ml-auto' : 'mr-auto'} max-w-[300px]`}>
                        <div className="shrink-0 flex items-center justify-center font-bold text-xs text-vmanous-ai-blue">
                          {item.day || <span className="text-purple-600 text-[9px] text-center leading-tight">Phase</span>}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#050816] text-xs md:text-sm group-hover:text-[#16A34A] transition-colors truncate">
                            {item.topic || item.phase}
                          </div>
                          {item.duration && (
                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider leading-none mt-0.5">
                              {item.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center Node */}
                    <div className="w-[10%] flex justify-center z-10">
                      <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#16A34A] shadow-sm ring-4 ring-green-50" />
                    </div>

                    {/* Empty Space Half */}
                    <div className="w-[45%]" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Vertical Flow */}
          <div className="md:hidden flex flex-col space-y-3 relative pl-4">
            <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-green-500" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative pl-3"
              >
                <div className="absolute -left-[19px] top-3.5 w-3 h-3 rounded-full bg-[#16A34A] border-2 border-white shadow-sm" />
                
                <div className={`p-3 rounded-lg border ${item.phase ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-purple-100' : 'bg-white border-gray-100'} shadow-sm`}>
                  <div className="text-[11px] font-semibold text-vmanous-ai-blue mb-0.5">
                    {item.day || item.duration}
                  </div>
                  <div className="font-medium text-[#050816] text-xs">
                    {item.topic || item.phase}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
