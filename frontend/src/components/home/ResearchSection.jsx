import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const ResearchSection = ({ areas }) => {
  const pipeline = ['Problem', 'Research', 'Experiment', 'Prototype', 'Evaluate'];

  return (
    <section className="py-8 md:py-10 bg-[#050816] relative overflow-hidden">
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl md: text-xl md:text-xl font-medium text-white mb-6">
            Explore. Experiment. Research.
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-16">
          {areas.map((area, index) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 backdrop-blur-sm hover:text-white hover:border-white/30 transition-all"
            >
              {area}
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            {pipeline.map((step, index) => (
              <React.Fragment key={step}>
                <div className="px-6 py-4 bg-vmanous-ai-blue/10 border border-vmanous-ai-blue/30 rounded-xl text-white font-medium backdrop-blur-sm text-center w-full md:w-auto">
                  {step}
                </div>
                {index < pipeline.length - 1 && (
                  <div className="hidden md:block w-12 h-px bg-gradient-to-r from-blue-400 to-transparent mx-2" />
                )}
                {index < pipeline.length - 1 && (
                  <div className="md:hidden h-8 w-px bg-gradient-to-b from-blue-400 to-transparent my-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link 
            to="/ai-summit" 
            className="inline-flex justify-center items-center px-8 py-4 border border-vmanous-green text-white font-medium rounded-xl hover:bg-vmanous-green transition-all group"
          >
            Explore AI Summit
            <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </Container>
    </section>
  );
};
