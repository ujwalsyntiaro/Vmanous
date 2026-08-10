import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';

const techNodes = [
  { name: 'Machine Learning', desc: 'Build predictive models and algorithms that learn from data.', angle: 0 },
  { name: 'Generative AI', desc: 'Explore modern generative models, LLM concepts and creative AI applications.', angle: 36 },
  { name: 'Data Science', desc: 'Analyze complex datasets to find actionable insights.', angle: 72 },
  { name: 'Computer Vision', desc: 'Implement visual recognition and processing systems.', angle: 108 },
  { name: 'NLP', desc: 'Process, analyze, and generate human language.', angle: 144 },
  { name: 'Deep Learning', desc: 'Build advanced neural networks for complex tasks.', angle: 180 },
  { name: 'AI Automation', desc: 'Create intelligent automated workflows and agents.', angle: 216 },
  { name: 'Predictive Analytics', desc: 'Forecast future trends based on historical data.', angle: 252 },
  { name: 'Responsible AI', desc: 'Develop ethical, fair, and transparent AI systems.', angle: 288 },
  { name: 'AI Research', desc: 'Push the boundaries of current artificial intelligence capabilities.', angle: 324 },
];

export const AITechnologyUniverse = () => {
  const [activeNode, setActiveNode] = useState(null);

  return (
    <section className="py-8 md:py-10 bg-[#050816] relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-medium text-white mb-3">
            Explore the World of AI
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            A complete technology ecosystem spanning from fundamental concepts to cutting-edge research.
          </p>
        </div>

        <div className="relative h-auto md:h-[480px] flex flex-col md:flex-row items-center justify-center max-w-4xl mx-auto py-4 md:py-0">
          {/* Central Node - White Circle */}
          <div className="relative md:absolute z-20 w-32 h-32 md:w-36 md:h-36 rounded-full bg-white text-vmanous-navy-dark flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.25)] border-4 border-gray-100 mb-6 md:mb-0">
            <span className="text-vmanous-navy-dark font-bold text-center leading-tight tracking-wider text-[11px] md:text-xs">
              ARTIFICIAL<br />INTELLIGENCE
            </span>
          </div>

          {/* Desktop Ring */}
          <div className="hidden md:block absolute w-[420px] h-[420px] rounded-full border border-white/10" />
          <div className="hidden md:block absolute w-[330px] h-[330px] rounded-full border border-white/10 border-dashed animate-[spin_60s_linear_infinite]" />

          {/* Nodes */}
          {techNodes.map((node) => {
            const rad = node.angle * (Math.PI / 180);
            // Desktop positioning radius
            const r = 210;
            const dx = Math.cos(rad) * r;
            const dy = Math.sin(rad) * r;

            const isLeft = node.angle > 90 && node.angle < 270;
            const isTop = node.angle > 180 && node.angle < 360;

            return (
              <div
                key={node.name}
                className="absolute z-30 transition-all duration-300 hidden md:block"
                style={{ transform: `translate(${dx}px, ${dy}px)` }}
                onMouseEnter={() => setActiveNode(node)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="relative">
                  <div className={`
                    px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap border backdrop-blur-md transition-all text-xs font-medium
                    ${activeNode?.name === node.name ? 'bg-vmanous-ai-blue text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110 z-40' : 'bg-[#080B1A]/90 text-gray-300 border-white/20 hover:border-white/40'}
                  `}>
                    {node.name}
                  </div>

                  {/* Adjacent Tooltip Popup */}
                  <AnimatePresence>
                    {activeNode?.name === node.name && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute z-50 w-56 bg-[#0A0E26] border border-blue-500/30 p-3.5 rounded-xl shadow-2xl backdrop-blur-xl pointer-events-none ${
                          isLeft
                            ? 'right-full mr-3 top-1/2 -translate-y-1/2'
                            : 'left-full ml-3 top-1/2 -translate-y-1/2'
                        }`}
                      >
                        <h4 className="text-xs font-semibold text-white mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-vmanous-ai-blue" />
                          {node.name}
                        </h4>
                        <p className="text-[11px] text-gray-300 leading-normal">{node.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Mobile list */}
          <div className="md:hidden flex flex-wrap justify-center gap-2.5 w-full px-4 relative z-20">
            {techNodes.map((node) => (
              <div
                key={node.name}
                onClick={() => setActiveNode(activeNode?.name === node.name ? null : node)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border ${activeNode?.name === node.name ? 'bg-vmanous-ai-blue text-white border-blue-400' : 'bg-[#080B1A] text-gray-300 border-white/20'}`}
              >
                {node.name}
              </div>
            ))}
          </div>

          {/* Mobile Tooltip Description */}
          <AnimatePresence>
            {activeNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="md:hidden mt-6 w-full max-w-xs bg-[#0A0E26] border border-blue-500/30 p-4 rounded-xl shadow-xl text-center backdrop-blur-xl"
              >
                <h4 className="text-sm font-semibold text-white mb-1">{activeNode.name}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{activeNode.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
