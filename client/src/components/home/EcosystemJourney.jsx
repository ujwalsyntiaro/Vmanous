import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

const steps = [
  { id: '01', title: 'Learn', desc: 'AI & Data Science Workshops' },
  { id: '02', title: 'Build', desc: 'Real-world Projects' },
  { id: '03', title: 'Research', desc: 'AI Research & Development' },
  { id: '04', title: 'Experience', desc: 'Industry Internship' },
  { id: '05', title: 'Achieve', desc: 'Certificate & Career Growth' }
];

const EcosystemJourney = () => {
  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-6">
            More Than a Workshop.<br/>An AI Career Ecosystem.
          </h2>
          <p className="text-lg text-gray-600">
            VMANOUS takes students beyond classroom learning by connecting practical workshops, research and industry experience.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line Desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-vmanous-ai-blue via-vmanous-ai-purple to-vmanous-green rounded-full opacity-20"></div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 lg:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex lg:flex-col items-center lg:text-center w-full lg:w-auto relative group"
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-vmanous-light border-2 border-white shadow-lg flex items-center justify-center mb-0 lg:mb-6 mr-6 lg:mr-0 z-10 group-hover:-translate-y-2 transition-transform duration-300">
                  <span className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-vmanous-ai-blue to-vmanous-ai-purple">
                    {step.id}
                  </span>
                </div>
                
                {/* Connecting Line Mobile */}
                {index !== steps.length - 1 && (
                  <div className="lg:hidden absolute left-12 top-24 bottom-[-40px] w-0.5 bg-gray-200"></div>
                )}

                <div>
                  <h3 className="text-xl md:text-2xl md: text-xl font-medium text-vmanous-navy-deep mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm font-medium">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EcosystemJourney;
