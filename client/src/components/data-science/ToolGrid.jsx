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
      className="bg-white p-4 sm:p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-vmanous-ai-blue p-2 bg-blue-50/80 rounded-lg group-hover:bg-vmanous-ai-blue group-hover:text-white transition-colors duration-300">
            <Icon size={22} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-vmanous-ai-blue uppercase bg-blue-50/50 px-2 py-0.5 rounded-full border border-blue-100/50">
            {tool.category}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-medium text-vmanous-navy-deep mb-1 group-hover:text-vmanous-ai-blue transition-colors">
          {tool.name}
        </h3>

        <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed mb-3">
          {tool.description}
        </p>
      </div>

      {/* Libraries & Frameworks revealed on cursor hover */}
      <div className="pt-2 border-t border-gray-100 group-hover:border-blue-100 transition-colors">
        <div className="max-h-0 opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-300 ease-out overflow-hidden">
          <p className="text-[10px] font-semibold text-vmanous-ai-blue uppercase tracking-wider mb-2">
            Libraries & Tech:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tool.libraries?.map((lib) => (
              <span
                key={lib}
                className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-blue-50/80 text-vmanous-ai-blue font-medium border border-blue-100 group-hover:scale-105 transition-transform duration-200"
              >
                {lib}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle default prompt when not hovered */}
        <div className="block group-hover:hidden transition-all duration-200">
          <span className="text-[10px] text-gray-400 font-normal flex items-center gap-1">
            <span>Hover to view libraries</span>
            <span className="text-[12px]">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const ToolGrid = () => {
  return (
    <section className="pt-6 md:pt-8 pb-6 md:pb-16 bg-white relative overflow-hidden">
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
