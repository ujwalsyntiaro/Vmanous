import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';

export const EcosystemSection = ({ nodes }) => {
  const [activeNode, setActiveNode] = useState(null);

  return (
    <section className="py-4 md:py-6 bg-gray-50 relative overflow-hidden">
      
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-2xl md:text-4xl font-medium text-gray-900 mb-6">
            One Ecosystem. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Multiple Paths Into AI.</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto h-auto md:h-[450px] flex flex-col md:flex-row items-center justify-center py-4 md:py-0">
          
          {/* Mobile Tooltip Description (Inline) */}
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div
                key={activeNode.title + '-mobile'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="md:hidden w-full max-w-sm bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl text-center z-50 mb-8 mx-auto"
              >
                <h4 className="text-lg text-white font-medium mb-2">{activeNode.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{activeNode.desc}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central Hub */}
          <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 w-36 h-36 rounded-full bg-gray-800 border border-gray-700 shadow-[0_0_100px_rgba(59,130,246,0.2)] flex items-center justify-center mb-8 md:mb-0">
            <span className="text-xl font-semibold text-white tracking-widest uppercase">VMANOUS</span>
          </div>

          {/* Lines */}
          <svg className="absolute top-1/2 left-1/2 overflow-visible z-0 hidden md:block">
            {nodes.map((node, i) => {
              const angle = (i * 360) / nodes.length;
              const rad = (angle * Math.PI) / 180;
              const r1 = 72; // radius of center (36 * 4 / 2)
              const r2 = 180; // radius of nodes
              const x1 = Math.cos(rad) * r1;
              const y1 = Math.sin(rad) * r1;
              const x2 = Math.cos(rad) * r2;
              const y2 = Math.sin(rad) * r2;
              return (
                <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" strokeDasharray="4 4" />
              );
            })}
          </svg>

          {/* Desktop Nodes */}
          {nodes.map((node, i) => {
            const angle = (i * 360) / nodes.length;
            const rad = (angle * Math.PI) / 180;
            const r = 200;
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
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2 flex justify-center">
                  <div className={`px-6 py-3 rounded-full border transition-all duration-300 ${activeNode?.title === node.title ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-110' : 'bg-gray-800 text-white border-gray-700 hover:border-gray-500 shadow-sm'}`}>
                    <span className="font-medium whitespace-nowrap">{node.title}</span>
                  </div>
                  
                  <AnimatePresence>
                    {activeNode?.title === node.title && (
                      <motion.div
                        initial={{ opacity: 0, y: dy > 0 ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: dy > 0 ? 10 : -10 }}
                        className={`absolute ${dy > 0 ? 'bottom-full mb-4' : 'top-full mt-4'} bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-xl w-64 text-center z-50 pointer-events-none`}
                      >
                        <h4 className="text-sm text-white font-medium mb-1">{node.title}</h4>
                        <p className="text-gray-300 text-xs leading-relaxed">{node.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeNode?.title === node.title ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-800 text-white border-gray-700 shadow-sm'}`}
              >
                {node.title}
              </button>
            ))}
          </div>


        </div>
      </Container>
    </section>
  );
};
