import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { dataScienceResearchAreas } from '../../constants/dataScience';
import { Network } from 'lucide-react';

const centerNodes = [
  { name: 'AI', x: '18%', y: '20%' },
  { name: 'Research', x: '50%', y: '10%' },
  { name: 'ML', x: '82%', y: '20%' },
  { name: 'Statistics', x: '18%', y: '80%' },
  { name: 'Visualization', x: '50%', y: '90%' },
  { name: 'Big Data', x: '82%', y: '80%' },
];

const ResearchSection = () => {
  return (
    <section className="py-8 md:py-16 bg-[#050816] relative overflow-hidden">
      {/* Network lines visual */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-8 backdrop-blur-md">
              <Network size={15} className="text-purple-400" />
              <span className="text-xs font-semibold tracking-wider text-vmanous-light">ADVANCED EXPLORATION</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-medium text-white mb-2 md:mb-6 leading-tight">
              Where Data Science Meets Research
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mb-6 md:mb-10">
              Push the boundaries of what's possible by exploring cutting-edge areas of artificial intelligence, machine learning, and advanced analytics.
            </p>

            <div className="flex flex-wrap gap-3">
              {dataScienceResearchAreas.map((area, index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                >
                  {area}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Network */}
          <div className="relative h-[480px] md:h-[560px] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Connecting SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {centerNodes.map((node, i) => (
                <motion.line
                  key={`line-${node.name}`}
                  x1={node.x}
                  y1={node.y}
                  x2="50%"
                  y2="50%"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                />
              ))}
            </svg>

            {/* Center Node */}
            <div className="relative z-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-vmanous-ai-blue to-purple-600 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse">
              <span className="text-white font-medium text-center text-xs sm:text-base leading-tight">DATA<br />SCIENCE</span>
            </div>

            {/* Connected Nodes */}
            {centerNodes.map((node, i) => (
              <motion.div
                key={node.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                className="absolute z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#080B1A] border border-white/20 flex items-center justify-center shadow-lg"
                style={{ top: node.y, left: node.x, transform: 'translate(-50%, -50%)' }}
              >
                <span className="text-gray-300 text-[11px] sm:text-xs font-medium text-center">{node.name}</span>
              </motion.div>
            ))}

            {/* Animated particles */}
            <div className="absolute inset-0 z-0">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-vmanous-ai-blue rounded-full shadow-[0_0_5px_#3b82f6]"
                  animate={{
                    x: [Math.random() * 400, 200, Math.random() * 400],
                    y: [Math.random() * 400, 200, Math.random() * 400],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default ResearchSection;
