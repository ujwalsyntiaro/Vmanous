import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { dataScienceTools } from '../../constants/dataScience';

const ToolCard = ({ tool, index }) => {
  const Icon = tool.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white p-3.5 sm:p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group flex flex-col justify-between"
    >
      <div>
        <div className="text-vmanous-ai-blue flex items-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 origin-left">
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-normal text-vmanous-navy-deep mb-0.5">{tool.name}</h3>
        <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-vmanous-ai-blue uppercase mb-1.5">{tool.category}</p>
        <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed">
          {tool.description}
        </p>
      </div>
    </motion.div>
  );
};

const ToolGrid = () => {
  return (
    <section className="py-6 md:py-16 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-[100px] -z-10" />
      
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-2 sm:mb-4">
            Explore the Data Science Toolkit
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Discover the technologies used across the modern Data Science workflow.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {dataScienceTools.map((tool, index) => (
            <ToolCard key={tool.name} tool={tool} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ToolGrid;
