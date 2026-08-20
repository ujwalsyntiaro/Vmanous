import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Database, Filter, LineChart, PieChart, BrainCircuit, Lightbulb } from 'lucide-react';

const ecosystemSteps = [
  { id: '01', title: 'Data Collection', icon: Database },
  { id: '02', title: 'Data Cleaning', icon: Filter },
  { id: '03', title: 'Data Analysis', icon: LineChart },
  { id: '04', title: 'Data Visualization', icon: PieChart },
  { id: '05', title: 'Machine Learning', icon: BrainCircuit },
  { id: '06', title: 'AI & Predictive Intelligence', icon: Lightbulb },
];

const DataScienceEcosystem = () => {
  return (
    <section className="py-10 md:py-14 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-6">
            Everything You Need to Explore Data Science
          </h2>
          <p className="text-lg text-gray-600">
            A complete connected ecosystem transforming raw data into actionable insights and intelligent systems.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-200 to-purple-100 -translate-y-1/2 hidden md:block z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
            {ecosystemSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center relative group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-blue-500/5 flex items-center justify-center border border-gray-100 text-vmanous-ai-blue group-hover:scale-110 group-hover:bg-vmanous-ai-blue group-hover:text-white transition-all duration-300 mb-4 z-10 relative">
                    <Icon size={28} />
                    <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gray-100 text-[10px] font-medium flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-vmanous-ai-blue transition-colors">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl md: text-sm font-medium text-vmanous-navy-deep text-center px-2">
                    {step.title}
                  </h3>
                  
                  {/* Mobile connector */}
                  {index < ecosystemSteps.length - 1 && (
                    <div className="h-8 w-px bg-blue-100 my-2 md:hidden" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DataScienceEcosystem;
