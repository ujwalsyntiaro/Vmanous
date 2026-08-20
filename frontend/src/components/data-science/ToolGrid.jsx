import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code2, Layers, CheckCircle2 } from 'lucide-react';
import Container from '../ui/Container';
import { dataScienceTools } from '../../constants/dataScience';

const ToolCard = ({ tool, index, onSelect }) => {
  const Icon = tool.icon;
  const [isHovered, setIsHovered] = useState(false);

  // Position side list: Right half cards open left, left half cards open right
  const isRightHalf = index % 4 >= 2 || index % 2 === 1;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Tool Card - Stays 100% visible, constant height, never covered */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="bg-white p-4 sm:p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full cursor-pointer relative z-10"
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

          <p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed">
            {tool.description}
          </p>
        </div>
      </motion.div>

      {/* Side List Box (Slim & Compact side list, no header) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              x: isRightHalf ? 10 : -10,
            }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: isRightHalf ? 10 : -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`hidden md:block absolute top-0 z-50 w-36 sm:w-40 bg-white p-2 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 ring-1 ring-black/5 ${
              isRightHalf ? 'right-full mr-2.5' : 'left-full ml-2.5'
            }`}
          >
            {/* Vertical Compact List View */}
            <ul className="space-y-1">
              {tool.libraries?.map((lib) => (
                <li
                  key={lib}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-[11px] font-medium hover:text-emerald-600 transition-all duration-200 group/item cursor-pointer"
                >
                  <CheckCircle2 className="w-3 h-3 text-slate-400 group-hover/item:text-emerald-600 transition-colors shrink-0" />
                  <span className="truncate">{lib}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToolGrid = () => {
  return (
    <section className="pt-6 md:pt-8 pb-6 md:pb-16 bg-white relative overflow-visible">
      {/* Background accents container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 rounded-full blur-[100px]" />
      </div>

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-2 sm:mb-4">
            Explore the Data Science Toolkit
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Discover the technologies used across the modern Data Science workflow.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 items-start relative">
          {dataScienceTools.map((tool, index) => (
            <ToolCard key={tool.name} tool={tool} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ToolGrid;

