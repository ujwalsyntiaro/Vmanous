import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { ArrowDown } from 'lucide-react';

const pathwaySteps = [
  "Workshop",
  "Practical Project",
  "Assessment",
  "Research",
  "Internship Opportunity",
  "Career Growth"
];

const InternshipPathway = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-vmanous-ai-blue/10 to-purple-500/10">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-white">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-6">
              Learn Data Science.<br />
              <span className="text-vmanous-ai-blue">Build Experience.</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Students demonstrating strong performance may be considered for advanced research and internship opportunities based on eligibility, evaluation and available opportunities.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {pathwaySteps.map((step, index) => (
              <React.Fragment key={step}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-vmanous-light px-4 py-3 rounded-xl border border-gray-100 text-center flex-1 w-full md:w-auto shadow-sm font-medium text-vmanous-navy-deep text-sm md:text-xs lg:text-sm"
                >
                  {step}
                </motion.div>
                
                {index < pathwaySteps.length - 1 && (
                  <div className="text-gray-300 md:-rotate-90 md:mx-0">
                    <ArrowDown size={20} className="md:hidden" />
                    <ArrowDown size={20} className="hidden md:block transform -rotate-90" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default InternshipPathway;
