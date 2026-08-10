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
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-vmanous-ai-blue/5 text-vmanous-ai-blue flex items-center justify-center mb-4 group-hover:bg-vmanous-ai-blue group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-xl md:text-2xl md: text-xl font-medium text-vmanous-navy-deep mb-1">{tool.name}</h3>
      <p className="text-xs font-medium tracking-wider text-vmanous-ai-blue uppercase mb-3">{tool.category}</p>
      <p className="text-gray-600 text-sm leading-relaxed">
        {tool.description}
      </p>
    </motion.div>
  );
};

const ToolGrid = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-[100px] -z-10" />
      
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-6">
            Explore the Data Science Toolkit
          </h2>
          <p className="text-lg text-gray-600">
            Discover the technologies used across the modern Data Science workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dataScienceTools.map((tool, index) => (
            <ToolCard key={tool.name} tool={tool} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ToolGrid;
