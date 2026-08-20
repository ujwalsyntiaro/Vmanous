import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { dataScienceLearningPath } from '../../constants/dataScience';

const DataScienceLearningPath = () => {
  return (
    <section id="learning-path" className="py-24 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-6">
            Your Data Science Learning Path
          </h2>
          <p className="text-lg text-gray-600">
            A structured roadmap from programming fundamentals to advanced artificial intelligence.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Horizontal Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 -translate-y-1/2" />

          {/* Mobile Vertical Line */}
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-blue-100 via-purple-100 to-blue-100" />

          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4">
            {dataScienceLearningPath.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex md:flex-col items-center md:items-center relative pl-16 md:pl-0"
              >
                {/* Number node */}
                <div className="absolute left-0 md:static w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg shadow-blue-500/10 flex items-center justify-center font-medium text-xl text-vmanous-ai-blue z-10 mb-4 ring-2 ring-blue-100">
                  {stage.stage}
                </div>

                <div className="md:text-center">
                  <h3 className="text-xl md:text-2xl md: font-medium text-vmanous-navy-deep whitespace-nowrap md:whitespace-normal mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {stage.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DataScienceLearningPath;
