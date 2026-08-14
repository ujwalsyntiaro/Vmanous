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
            return (
              <div key={step.step} className="relative">
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 w-full text-center ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block px-3 py-1 bg-white/5 rounded-lg text-vmanous-ai-blue font-mono font-medium text-xs mb-2 border border-white/10">
                      Step {step.step}
                    </div>
                    <h3 className="text-lg md:text-xl font-medium text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-snug">{step.description}</p>
                  </div>
                  
                  <div className="relative shrink-0 w-16 h-16 rounded-full border-4 border-[#080B1A] bg-gradient-to-br from-vmanous-ai-blue to-purple-600 flex items-center justify-center shadow-lg shadow-vmanous-ai-blue/20 z-10">
                    <Icon size={24} className="text-white" />
                  </div>
                  
                  <div className="flex-1 w-full hidden md:block" />
                </motion.div>
                
                {/* Connecting line */}
                {index < dataScienceWorkflow.length - 1 && (
                  <div className="flex justify-center my-2 md:my-0">
                    <div className="w-1 md:absolute left-1/2 md:-ml-0.5 h-12 md:h-full bg-gradient-to-b from-vmanous-ai-blue/50 to-transparent top-16 -bottom-4 rounded-full flex justify-center z-0">
                      <motion.div 
                        animate={{ y: [0, 50, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                        className="w-2 h-2 rounded-full bg-white mt-4 shadow-[0_0_10px_#fff]"
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
