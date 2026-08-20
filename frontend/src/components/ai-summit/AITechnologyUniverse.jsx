import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';

const techNodes = [
  { name: 'Machine Learning', desc: 'Build predictive models and algorithms that learn from data.', angle: 0 },
  { name: 'Generative AI', desc: 'Explore modern generative models, LLM concepts and creative AI applications.', angle: 32 },
  { name: 'Data Science', desc: 'Analyze complex datasets to find actionable insights.', angle: 58 },
  { name: 'Computer Vision', desc: 'Implement visual recognition and processing systems.', angle: 122 },
  { name: 'NLP', desc: 'Process, analyze, and generate human language.', angle: 148 },
  { name: 'Deep Learning', desc: 'Build advanced neural networks for complex tasks.', angle: 180 },
  { name: 'AI Automation', desc: 'Create intelligent automated workflows and agents.', angle: 212 },
  { name: 'Predictive Analytics', desc: 'Forecast future trends based on historical data.', angle: 238 },
  { name: 'Responsible AI', desc: 'Develop ethical, fair, and transparent AI systems.', angle: 302 },
  { name: 'AI Research', desc: 'Push the boundaries of current artificial intelligence capabilities.', angle: 328 },
];

export const AITechnologyUniverse = () => {
  const [activeNode, setActiveNode] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rx = windowWidth < 480 ? 150 : windowWidth < 640 ? 170 : windowWidth < 768 ? 195 : 230;
  const ry = windowWidth < 480 ? 180 : windowWidth < 640 ? 195 : windowWidth < 768 ? 215 : 230;

  return (
    <section className="py-8 md:py-16 bg-[#030712] relative overflow-hidden">
      {/* Background Ambient Glow & Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <Container>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-14 relative z-10">
          <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white mb-4">
            Explore the World of AI
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
            A complete technology ecosystem spanning from fundamental concepts to cutting-edge research.
          </p>
        </div>

        <div className="relative min-h-[480px] xs:min-h-[500px] sm:min-h-[520px] md:min-h-[540px] flex items-center justify-center max-w-5xl mx-auto py-2 md:py-0 overflow-visible">
          {/* Glowing Ambient Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

          {/* Central Node Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#090D16] border-2 border-cyan-400/40 text-white flex flex-col items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.25)] group cursor-pointer transition-all duration-500 hover:scale-105 hover:border-cyan-400 hover:shadow-[0_0_60px_rgba(34,211,238,0.4)]">
            <div className="absolute inset-0 rounded-full bg-cyan-400/5 animate-pulse pointer-events-none" />
            <span className="text-white font-medium text-center leading-tight tracking-wider text-[10px] xs:text-xs md:text-sm bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
              ARTIFICIAL<br />INTELLIGENCE
            </span>
          </div>

          {/* Futuristic Orbit Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[360px] sm:w-[340px] sm:h-[400px] md:w-[460px] md:h-[460px] rounded-full border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] pointer-events-none" />
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-dashed border-cyan-400/20 animate-[spin_80s_linear_infinite] pointer-events-none" />

          {/* Orbit Nodes Aligned in Circle around Central Core */}
          {techNodes.map((node) => {
            const rad = node.angle * (Math.PI / 180);
            const dx = Math.cos(rad) * rx;
            const dy = Math.sin(rad) * ry;

            const isLeft = node.angle > 90 && node.angle < 270;
            const isActive = activeNode?.name === node.name;

            return (
              <div
                key={node.name}
                className="absolute z-30 transition-all duration-300"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
                }}
                onClick={() => setActiveNode(isActive ? null : node)}
                onMouseEnter={() => setActiveNode(node)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="relative">
                  <div className={`
                    px-2 py-1 xs:px-3 xs:py-1.5 md:px-4 md:py-2 rounded-2xl sm:rounded-full cursor-pointer border backdrop-blur-xl transition-all duration-300 text-[10px] xs:text-xs font-medium flex items-center gap-1.5 text-center
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.5)] scale-110 z-40'
                      : 'bg-[#0B132B]/90 text-slate-200 border-slate-700/60 hover:border-cyan-400/60 hover:bg-[#0F172A] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'}
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors shrink-0 ${isActive ? 'bg-white' : 'bg-cyan-400'}`} />
                    <span className="text-center leading-tight">
                      {node.name === 'Machine Learning' ? (
                        <>Machine<br className="sm:hidden" /> Learning</>
                      ) : node.name === 'Deep Learning' ? (
                        <>Deep<br className="sm:hidden" /> Learning</>
                      ) : node.name === 'Computer Vision' ? (
                        <>Computer<br className="sm:hidden" /> Vision</>
                      ) : node.name === 'Predictive Analytics' ? (
                        <>Predictive<br className="sm:hidden" /> Analytics</>
                      ) : node.name === 'Responsible AI' ? (
                        <>Responsible<br className="sm:hidden" /> AI</>
                      ) : (
                        node.name
                      )}
                    </span>
                  </div>

                  {/* Desktop Tooltip / Details Popup */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`hidden md:block absolute z-50 w-56 sm:w-60 bg-[#0A0F24]/95 border border-cyan-400/40 p-3 sm:p-4 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl pointer-events-none ${isLeft
                            ? 'right-full mr-3 top-1/2 -translate-y-1/2'
                            : 'left-full ml-3 top-1/2 -translate-y-1/2'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <h4 className="text-xs font-medium text-white tracking-wide">
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
        </div>

        {/* Mobile View Active Node Details Box (Displayed in the empty space below orbit) */}
        <div className="block md:hidden mt-4 px-4 max-w-md mx-auto min-h-[90px]">
          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div
                key={activeNode.name}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0A0F24]/95 border border-cyan-400/50 p-4 rounded-2xl shadow-[0_10px_35px_rgba(34,211,238,0.2)] backdrop-blur-2xl text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" />
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <h4 className="text-sm font-medium text-white tracking-wide">
                    {activeNode.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {activeNode.desc}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#0B132B]/40 border border-slate-800/80 p-3.5 rounded-2xl text-center backdrop-blur-md"
              >
                <p className="text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-400/60 animate-ping" />
                  Tap any technology node above to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
