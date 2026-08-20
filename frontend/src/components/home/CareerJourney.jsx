import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

const CareerJourney = () => {
  const phases = [
    { label: 'LEARN', desc: 'AI Workshops' },
    { label: 'BUILD', desc: 'Practical Projects' },
    { label: 'RESEARCH', desc: 'AI Research & Development' },
    { label: 'INTERN', desc: 'Industry Internship' },
    { label: 'GROW', desc: 'Career Opportunities' }
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-4">From Classroom to Career</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">VMANOUS provides a complete student journey, turning foundational knowledge into tangible industry experience.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line Desktop */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-8 md:gap-0">
            {phases.map((phase, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-row md:flex-col items-center md:items-center w-full md:w-48 group relative"
              >
                {/* Connecting Line Mobile */}
                {index !== phases.length - 1 && (
                  <div className="md:hidden absolute left-8 top-16 bottom-[-32px] w-0.5 bg-gray-200"></div>
                )}
                
                <div className="w-16 h-16 rounded-full bg-white border-4 border-vmanous-light shadow-md flex items-center justify-center flex-shrink-0 z-10 mr-6 md:mr-0 md:mb-6 group-hover:border-vmanous-green transition-colors duration-300">
                  <div className="w-4 h-4 rounded-full bg-vmanous-navy-dark group-hover:bg-vmanous-green transition-colors duration-300"></div>
                </div>
                
                <div className="text-left md:text-center">
                  <h4 className="text-lg md:text-xl md: text-sm font-medium tracking-widest text-vmanous-ai-blue mb-1 uppercase">{phase.label}</h4>
                  <p className="text-vmanous-navy-deep font-semibold text-lg">{phase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CareerJourney;
