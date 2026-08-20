import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { vision } from '../../constants/about';
import { ArrowRight } from 'lucide-react';

const VisionSection = () => {
  const steps = ["Learn", "Build", "Research", "Experience", "Grow"];
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
      <Container className="text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep mb-6">{vision.heading}</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          "{vision.text}"
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-6 py-3 bg-white shadow-sm border border-gray-100 rounded-full font-medium text-vmanous-navy-light text-lg"
              >
                {step}
              </motion.div>
              {index < steps.length - 1 && (
                <ArrowRight className="text-gray-400 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default VisionSection;
