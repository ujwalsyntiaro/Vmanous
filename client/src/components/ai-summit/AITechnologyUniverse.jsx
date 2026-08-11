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
    <section className="py-12 md:py-16 bg-[#030712] relative overflow-hidden">
      {/* Background Ambient Glow & Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 relative z-10">
          <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white mb-4">
            Explore the World of AI
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            A complete technology ecosystem spanning from fundamental concepts to cutting-edge research.
          </p>
        </div>

        <div className="relative h-auto md:h-[520px] flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto py-6 md:py-0">
          {/* Glowing Ambient Core */}
          <div className="hidden md:block absolute w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

          {/* Central Node Core */}
          <div className="relative z-20 w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#090D16] border-2 border-cyan-400/40 text-white flex flex-col items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.25)] mb-8 md:mb-0 group cursor-pointer transition-all duration-500 hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_60px_rgba(34,211,238,0.4)]">
            <div className="absolute inset-0 rounded-full bg-cyan-400/5 animate-pulse pointer-events-none" />
            <span className="text-cyan-400 text-[10px] uppercase font-medium tracking-[0.25em] mb-1">VMANOUS</span>
            <span className="text-white font-medium text-center leading-tight tracking-wider text-xs md:text-sm bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              ARTIFICIAL<br />INTELLIGENCE
            </span>
          </div>

          {/* Futuristic Orbit Rings */}
          <div className="hidden md:block absolute w-[460px] h-[460px] rounded-full border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]" />
          <div className="hidden md:block absolute w-[360px] h-[360px] rounded-full border border-dashed border-cyan-400/20 animate-[spin_80s_linear_infinite]" />
          <div className="hidden md:block absolute w-[260px] h-[260px] rounded-full border border-purple-500/15" />

          {/* Nodes */}
          {techNodes.map((node) => {
            const rad = node.angle * (Math.PI / 180);
            const r = 230;
            const dx = Math.cos(rad) * r;
            const dy = Math.sin(rad) * r;

            const isLeft = node.angle > 90 && node.angle < 270;
            const isActive = activeNode?.name === node.name;

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
                    px-4 py-2 rounded-full cursor-pointer whitespace-nowrap border backdrop-blur-xl transition-all duration-300 text-xs font-semibold flex items-center gap-2
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.5)] scale-110 z-40'
                      : 'bg-[#0B132B]/80 text-slate-200 border-slate-700/60 hover:border-cyan-400/60 hover:bg-[#0F172A] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'}
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-white' : 'bg-cyan-400'}`} />
                    {node.name}
                  </div>

                  {/* Tooltip Popup */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute z-50 w-60 bg-[#0A0F24]/95 border border-cyan-400/40 p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-none ${isLeft
                          ? 'right-full mr-3 top-1/2 -translate-y-1/2'
                          : 'left-full ml-3 top-1/2 -translate-y-1/2'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <h4 className="text-xs font-bold text-white tracking-wide">
                            {node.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{node.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Mobile Pills Grid */}
          <div className="md:hidden flex flex-wrap justify-center gap-2.5 w-full px-4 relative z-20">
            {techNodes.map((node) => (
              <div
                key={node.name}
                onClick={() => setActiveNode(activeNode?.name === node.name ? null : node)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold border backdrop-blur-lg ${activeNode?.name === node.name
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'bg-[#0B132B]/90 text-slate-300 border-slate-700/60'
                  }`}
              >
                {node.name}
              </div>
            ))}
          </div>

          {/* Mobile Active Node Card */}
          <AnimatePresence>
            {activeNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="md:hidden mt-6 w-full max-w-xs bg-[#0A0F24]/95 border border-cyan-400/40 p-4 rounded-2xl shadow-2xl text-center backdrop-blur-2xl"
              >
                <h4 className="text-sm font-bold text-white mb-1">{activeNode.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{activeNode.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
