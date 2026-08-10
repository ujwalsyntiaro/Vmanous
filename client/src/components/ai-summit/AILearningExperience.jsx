import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Database, Brain, Rocket, Code2, LineChart, FileCheck } from 'lucide-react';

export const AILearningExperience = () => {
  const steps = [
    { num: '01', title: 'AI Fundamentals', icon: Brain, desc: 'Core concepts' },
    { num: '02', title: 'Python & Data', icon: Code2, desc: 'Data wrangling' },
    { num: '03', title: 'Machine Learning', icon: LineChart, desc: 'Model building' },
    { num: '04', title: 'Generative AI', icon: Rocket, desc: 'Modern LLMs' },
    { num: '05', title: 'Practical Project', icon: Database, desc: 'Hands-on app' },
    { num: '06', title: 'Evaluation', icon: FileCheck, desc: 'Assessment' }
  ];

  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            From Concepts to Intelligent Systems
          </h2>
          <p className="text-lg text-gray-600">
            A comprehensive journey designed to transform beginners into confident AI practitioners.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Horizontal Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 -translate-y-1/2" />
          
          {/* Mobile Vertical Line */}
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-blue-100 via-purple-100 to-blue-100" />

          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex md:flex-col items-center md:items-center relative pl-16 md:pl-0"
                >
                  <div className="absolute left-0 md:static w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-lg shadow-blue-500/10 flex items-center justify-center text-vmanous-ai-blue z-10 mb-4 group hover:bg-vmanous-ai-blue hover:text-white transition-colors">
                    <Icon size={24} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 text-[10px] font-medium flex items-center justify-center text-gray-600">
                      {step.num}
                    </div>
                  </div>
                  
                  <div className="md:text-center">
                    <h3 className="text-xl md:text-2xl font-medium text-vmanous-navy-deep whitespace-nowrap md:whitespace-normal mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};
