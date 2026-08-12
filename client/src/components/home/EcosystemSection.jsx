import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { CheckCircle2 } from 'lucide-react';

export const EcosystemSection = ({ nodes }) => {
  const [activeNode, setActiveNode] = useState(null);

  return (
    <section className="py-0 md:py-16 bg-gray-50 relative overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Side: Diagram */}
          <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">

            {/* Mobile Tooltip Description (Inline) */}
            <AnimatePresence mode="wait">
              {activeNode && (
                <motion.div
                  key={activeNode.title + '-mobile'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="md:hidden absolute top-0 w-full max-w-sm bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl text-center z-50 mx-auto"
                >
                  <h4 className="text-lg text-white font-medium mb-2">{activeNode.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{activeNode.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-32 h-32 md:w-36 md:h-36 rounded-full bg-gray-900 border border-gray-700 shadow-[0_0_80px_rgba(59,130,246,0.3)] flex items-center justify-center">
              <span className="text-lg md:text-xl font-semibold text-white tracking-widest uppercase">VMANOUS</span>
            </div>

            {/* Lines */}
            <svg className="absolute top-1/2 left-1/2 overflow-visible z-0 hidden md:block">
              {nodes.map((node, i) => {
                const angle = (i * 360) / nodes.length;
                const rad = (angle * Math.PI) / 180;
                const r1 = 65; // radius of center
                const r2 = 160; // radius of nodes
                const x1 = Math.cos(rad) * r1;
                const y1 = Math.sin(rad) * r1;
                const x2 = Math.cos(rad) * r2;
                const y2 = Math.sin(rad) * r2;
                return (
                  <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
                );
              })}
            </svg>

            {/* Desktop Nodes */}
            {nodes.map((node, i) => {
              const angle = (i * 360) / nodes.length;
              const rad = (angle * Math.PI) / 180;
              const r = 180;
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
                    <div className={`px-5 py-2.5 rounded-full border border-gray-700 bg-gray-800 text-white transition-all duration-300 ${activeNode?.title === node.title ? 'shadow-xl scale-110' : 'shadow-sm'}`}>
                      <span className="font-medium whitespace-nowrap text-sm">{node.title}</span>
                    </div>

                    <AnimatePresence>
                      {activeNode?.title === node.title && (
                        <motion.div
                          initial={{ opacity: 0, y: dy > 0 ? 10 : -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: dy > 0 ? 10 : -10 }}
                          className={`absolute ${dy > 0 ? 'bottom-full mb-3' : 'top-full mt-3'} bg-white border border-gray-100 p-4 rounded-xl shadow-xl w-64 text-center z-50 pointer-events-none`}
                        >
                          <h4 className="text-sm text-gray-900 font-semibold mb-1">{node.title}</h4>
                          <p className="text-gray-600 text-xs leading-relaxed">{node.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}

            {/* Mobile Nodes */}
            <div className="md:hidden absolute bottom-0 flex flex-wrap justify-center gap-2 w-full px-2 z-30">
              {nodes.map((node) => (
                <button
                  key={node.title}
                  onClick={() => setActiveNode(node)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border border-gray-700 bg-gray-800 text-white transition-all duration-300 ${activeNode?.title === node.title ? 'scale-110 shadow-xl' : 'shadow-sm'}`}
                >
                  {node.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 leading-tight">
              One Ecosystem. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Multiple Paths Into AI.</span>
            </h2>

            <p className="text-base text-gray-600 leading-relaxed mb-8">
              At VMANOUS, we've engineered a comprehensive AI ecosystem designed to accelerate your journey in Artificial Intelligence. Our interconnected platforms ensure you have the exclusive resources to succeed at every stage of your AI career.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">AI Innovation Network</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Experience a seamless transition from theoretical AI concepts to practical, industry-grade AI projects, preventing knowledge fragmentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">VMANOUS AI Summit</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Participate in our exclusive AI Summit, where you can engage in cutting-edge AI research, collaborate with experts, and secure top-tier AI internships.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};
