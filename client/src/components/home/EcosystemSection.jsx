import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';

export const EcosystemSection = ({ nodes }) => {
  const [activeNode, setActiveNode] = useState(nodes[0]);

  return (
    <section className="py-8 md:py-10 bg-[#050816] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl font-medium text-white mb-6">
            One Ecosystem. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Multiple Paths Into AI.</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto h-auto md:h-[600px] flex flex-col md:flex-row items-center justify-center py-8 md:py-0">
          
          {/* Mobile Tooltip Description (Inline) */}
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeNode.title + '-mobile'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden w-full max-w-sm bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl text-center backdrop-blur-xl z-50 mb-8"
              >
                <h4 className="text-lg text-white font-medium mb-2">{activeNode.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{activeNode.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central Hub */}
          <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 w-48 h-48 rounded-full bg-gradient-to-br from-[#080B1A] to-[#12162A] border border-white/20 shadow-[0_0_100px_rgba(59,130,246,0.2)] flex items-center justify-center backdrop-blur-xl mb-8 md:mb-0">
            <span className="text-2xl font-semibold text-white tracking-widest uppercase">VMANOUS</span>
          </div>

          {/* Lines */}
          <svg className="absolute top-1/2 left-1/2 overflow-visible z-0 hidden md:block">
            {nodes.map((node, i) => {
              const angle = (i * 360) / nodes.length;
              const rad = (angle * Math.PI) / 180;
              const r1 = 96; // radius of center
              const r2 = 200; // radius of nodes
              const x1 = Math.cos(rad) * r1;
              const y1 = Math.sin(rad) * r1;
              const x2 = Math.cos(rad) * r2;
              const y2 = Math.sin(rad) * r2;
              return (
                <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
              );
            })}
          </svg>

          {/* Desktop Nodes */}
          {nodes.map((node, i) => {
            const angle = (i * 360) / nodes.length;
            const rad = (angle * Math.PI) / 180;
            const r = 240;
            const dx = Math.cos(rad) * r;
            const dy = Math.sin(rad) * r;
            
            return (
              <motion.div
                key={node.title}
                initial={{ opacity: 0, scale: 0, x: dx, y: dy }}
                whileInView={{ opacity: 1, scale: 1, x: dx, y: dy }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="absolute top-1/2 left-1/2 z-30 hidden md:flex cursor-pointer group"
                onMouseEnter={() => setActiveNode(node)}
              >
                <div className={`-translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full border backdrop-blur-md transition-all duration-300 ${activeNode.title === node.title ? 'bg-vmanous-ai-blue text-white border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.4)] scale-110' : 'bg-[#080B1A]/80 text-gray-300 border-white/20 hover:border-white/40'}`}>
                  <span className="font-medium whitespace-nowrap">{node.title}</span>
                </div>
              </motion.div>
            );
          })}
          
          {/* Mobile Nodes */}
          <div className="md:hidden flex flex-wrap justify-center gap-3 w-full px-4 relative z-30">
            {nodes.map((node) => (
              <button
                key={node.title}
                onClick={() => setActiveNode(node)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeNode.title === node.title ? 'bg-vmanous-ai-blue text-white border-blue-400' : 'bg-[#080B1A] text-gray-300 border-white/20'}`}
              >
                {node.title}
              </button>
            ))}
          </div>

          {/* Desktop Tooltip Description (Absolute) */}
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeNode.title + '-desktop'}
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: -10, x: "-50%" }}
                className="hidden md:block absolute bottom-12 left-1/2 bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl max-w-sm text-center backdrop-blur-xl z-50"
              >
                <h4 className="text-xl text-white font-medium mb-2">{activeNode.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{activeNode.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
};
