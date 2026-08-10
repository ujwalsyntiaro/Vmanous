import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { dataScienceCareerPaths } from '../../constants/dataScience';

const CareerPath = () => {
  return (
    <section className="py-12 md:py-16 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-6">
            Where Data Science Can Take You
          </h2>
          <p className="text-lg text-gray-600">
            Explore the diverse professional roles available in the modern data ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataScienceCareerPaths.map((career, index) => (
            <motion.div
              key={career.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-vmanous-light p-8 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors group"
            >
              <h3 className="text-xl md:text-2xl md: text-xl font-medium text-vmanous-navy-deep mb-4 group-hover:text-vmanous-ai-blue transition-colors">
                {career.role}
              </h3>
              
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Core Skills</div>
                <div className="text-gray-700 text-sm font-medium">{career.skills}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Typical Tools</div>
                <div className="text-vmanous-ai-blue text-sm font-medium">{career.tools}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CareerPath;
