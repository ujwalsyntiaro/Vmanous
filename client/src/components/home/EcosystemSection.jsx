import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { 
  Target, 
  BarChart3, 
  Database, 
  Folder, 
  Microscope, 
  Briefcase, 
  CheckCircle2 
} from 'lucide-react';

export const EcosystemSection = ({ nodes = [] }) => {
  const [activeNode, setActiveNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getNodeIcon = (title) => {
    const iconClass = "w-5 h-5 xs:w-6 xs:h-6 md:w-7 md:h-7 text-emerald-500 stroke-[2.2]";
    switch (title) {
      case 'AI Summit':
        return <Target className={iconClass} />;
      case 'AI & Data Science':
        return <BarChart3 className={iconClass} />;
      case 'Data Science':
        return <Database className={iconClass} />;
      case 'Projects':
        return <Folder className={iconClass} />;
      case 'Research':
        return <Microscope className={iconClass} />;
      case 'Internships':
        return <Briefcase className={iconClass} />;
      default:
        return <Target className={iconClass} />;
    }
  };

  const rOrbit = isMobile ? 125 : 180;

  return (
    <section className="pt-6 md:pt-10 pb-12 md:pb-20 bg-[#F7FCF9] relative overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left / Center: Circular Orbit Diagram */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-[360px] xs:max-w-[400px] md:max-w-[500px] h-[360px] xs:h-[400px] md:h-[480px] flex items-center justify-center">

              {/* Soft Center Mint Glow */}
              <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

              {/* SVG Orbit Lines */}
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-visible z-0 pointer-events-none">
                {/* Outer Dashed Orbit Circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={rOrbit}
                  stroke="#A7F3D0"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                />

                {/* Spoke Dots on Orbit Circle */}
                {nodes && nodes.map((node, i) => {
                  const angle = -90 + (i * 360) / (nodes.length || 6);
                  const rad = (angle * Math.PI) / 180;
                  const x2 = Math.cos(rad) * rOrbit;
                  const y2 = Math.sin(rad) * rOrbit;
                  return (
                    <circle
                      key={`dot-${i}`}
                      cx={`calc(50% + ${x2}px)`}
                      cy={`calc(50% + ${y2}px)`}
                      r="4"
                      fill="#10B981"
                    />
                  );
                })}
              </svg>

              {/* Central Hub */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 xs:w-28 xs:h-28 md:w-36 md:h-36 rounded-full bg-[#0D1527] shadow-[0_12px_35px_rgba(13,21,39,0.25)] flex items-center justify-center border-4 border-white">
                <span className="text-xs xs:text-sm md:text-base font-bold text-white tracking-[0.25em] uppercase">
                  VMANOUS
                </span>
              </div>

              {/* Orbit Nodes Fixed at Circle Border Positions */}
              {nodes && nodes.map((node, i) => {
                const angle = -90 + (i * 360) / (nodes.length || 6);
                const rad = (angle * Math.PI) / 180;
                const dx = Math.cos(rad) * rOrbit;
                const dy = Math.sin(rad) * rOrbit;
                const isActive = activeNode?.title === node.title;

                return (
                  <div
                    key={node.title}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
                    }}
                    className="z-30 cursor-pointer flex flex-col items-center justify-center text-center group"
                    onClick={() => setActiveNode(isActive ? null : node)}
                    onMouseEnter={() => setActiveNode(node)}
                    onMouseLeave={() => setActiveNode(null)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex flex-col items-center justify-center text-center"
                    >
                      {/* White Circular Badge */}
                      <div
                        className={`w-12 h-12 xs:w-14 xs:h-14 md:w-16 md:h-16 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border transition-all duration-300 flex items-center justify-center ${
                          isActive
                            ? 'border-emerald-500 scale-110 shadow-emerald-500/20 shadow-lg ring-4 ring-emerald-500/15'
                            : 'border-slate-100 group-hover:border-emerald-300 group-hover:scale-105 group-hover:shadow-md'
                        }`}
                      >
                        {getNodeIcon(node.title)}
                      </div>

                      {/* Text Label Below Icon */}
                      <span
                        className={`mt-1 xs:mt-1.5 text-[11px] xs:text-xs md:text-sm font-semibold text-center leading-tight max-w-[80px] xs:max-w-[90px] md:max-w-[110px] transition-colors duration-200 ${
                          isActive ? 'text-emerald-600 font-bold' : 'text-slate-800 group-hover:text-emerald-600'
                        }`}
                      >
                        {node.title}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Active Node Description Card (Below Graphic) */}
            <div className="h-16 w-full max-w-sm mt-3 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {activeNode ? (
                  <motion.div
                    key={activeNode.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="bg-white border border-emerald-100 px-4 py-3 rounded-xl shadow-sm text-center w-full"
                  >
                    <h4 className="text-xs font-bold text-emerald-700">{activeNode.title}</h4>
                    <p className="text-slate-600 text-[11px] leading-tight line-clamp-2 mt-0.5">
                      {activeNode.desc}
                    </p>
                  </motion.div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Tap any item to view description
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Section Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4 leading-tight">
              One Ecosystem. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Multiple Paths Into AI.
              </span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed mb-8">
              At VMANOUS, we've engineered a comprehensive AI ecosystem designed to accelerate your journey in Artificial Intelligence. Our interconnected platforms ensure you have the exclusive resources to succeed at every stage of your AI career.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-900 mb-1">AI Innovation Network</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Experience a seamless transition from theoretical AI concepts to practical, industry-grade AI projects, preventing knowledge fragmentation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-900 mb-1">VMANOUS AI Summit</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
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
