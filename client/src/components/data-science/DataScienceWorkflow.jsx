import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { dataScienceWorkflow } from '../../constants/dataScience';
import { ArrowDown, Database, Filter, Search, PieChart, BrainCircuit, Lightbulb } from 'lucide-react';

const icons = [Database, Filter, Search, PieChart, BrainCircuit, Lightbulb];

const DataScienceWorkflow = () => {
  return (
    <section className="py-8 md:py-16 bg-[#080B1A] relative overflow-hidden">
      {/* Visual background */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-medium text-white mb-2 sm:mb-4">
            How Data Becomes Intelligence
          </h2>
          <p className="text-base sm:text-lg text-gray-400">
            Follow the complete workflow from raw information to predictive models.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {dataScienceWorkflow.map((step, index) => {
            const Icon = icons[index];
            const cycleDuration = dataScienceWorkflow.length;

            return (
              <div key={step.step} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-2 md:gap-6 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 w-full text-center ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block px-3 py-1 bg-white/5 rounded-lg text-vmanous-ai-blue font-mono font-medium text-xs mb-1 md:mb-2 border border-white/10">
                      Step {step.step}
                    </div>
                    <h3 className="text-base md:text-xl font-medium text-white mb-1 md:mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-xs md:text-base leading-snug">{step.description}</p>
                  </div>

                  <motion.div
                    animate={{
                      boxShadow: [
                        "0px 0px 10px 0px rgba(59, 130, 246, 0.2)",
                        "0px 0px 25px 8px rgba(168, 85, 247, 0.8)",
                        "0px 0px 10px 0px rgba(59, 130, 246, 0.2)",
                        "0px 0px 10px 0px rgba(59, 130, 246, 0.2)"
                      ],
                      borderColor: [
                        "#080B1A",
                        "#a855f7",
                        "#080B1A",
                        "#080B1A"
                      ],
                      scale: [1, 1.1, 1, 1]
                    }}
                    transition={{
                      duration: cycleDuration,
                      repeat: Infinity,
                      delay: index * 1,
                      times: [0, 0.1, 0.3, 1]
                    }}
                    className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full border-[3px] md:border-4 bg-[#080B1A] bg-gradient-to-br from-vmanous-ai-blue to-purple-600 flex items-center justify-center shadow-lg shadow-vmanous-ai-blue/20 z-10"
                  >
                    <Icon className="text-white w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>

                  <div className="flex-1 w-full hidden md:block" />
                </motion.div>

                {/* Connecting line */}
                {index < dataScienceWorkflow.length - 1 && (
                  <div className="flex justify-center my-1 md:my-0">
                    <div className="w-1 md:absolute md:left-1/2 md:-ml-0.5 h-6 md:h-full md:top-16 md:-bottom-4 rounded-full flex justify-center z-0 overflow-hidden relative bg-white/5">
                      {/* Growing line background on scroll */}
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                        style={{ transformOrigin: "top" }}
                        className="absolute inset-0 w-full h-full bg-gradient-to-b from-vmanous-ai-blue/50 to-transparent rounded-full"
                      />
                      {/* Continuous flowing drop */}
                      <motion.div
                        animate={{ top: ["-10%", "110%"], opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          delay: index * 1,
                          repeatDelay: cycleDuration - 1
                        }}
                        className="absolute w-2 h-4 rounded-full bg-white shadow-[0_0_10px_#fff] left-1/2 -translate-x-1/2"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default DataScienceWorkflow;
