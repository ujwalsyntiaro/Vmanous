import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { CheckCircle2, ChevronRight, X, Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const SummitPrograms = ({ programs }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const scrollToSection = (targetId) => {
    if (!targetId) return;
    const cleanId = targetId.replace('#', '');
    const element = document.getElementById(cleanId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProgramClick = (program, e) => {
    e.preventDefault();
    setSelectedProgram(program);
  };

  const getProgramBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Hands-on & Certificate</span>
          </div>
        );
      case 1:
        return (
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Research & Mentorship</span>
          </div>
        );
      case 2:
        return (
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>Live Prototype Projects</span>
          </div>
        );
      case 3:
        return (
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span>Industry Exposure</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="programs" className="py-6 md:py-10 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-3">
            Inside the AI Summit
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            A structured progression of programs designed to build knowledge, experience, and industry readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#F8FAFC] rounded-lg p-5 sm:p-6 md:p-7 border border-gray-100 shadow-sm hover:bg-white hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col h-full group"
            >
              {/* Header Badge */}
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-semibold text-vmanous-ai-blue tracking-widest uppercase">
                  Program 0{index + 1}
                </div>
                <div className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-full shadow-xs">
                  {program.duration}
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-vmanous-navy-deep mb-2">
                {program.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                {program.description}
              </p>
              
              {/* Focus Areas */}
              <div className="mb-4 flex-grow">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {program.topics.map(topic => (
                    <span key={topic} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-md shadow-2xs">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Special Note / Projects if Program 3 or 4 */}
              {program.id === 'program-03' ? (
                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 mb-4">
                  <div className="text-[10px] font-bold text-vmanous-ai-blue uppercase tracking-wider mb-1">Example Projects</div>
                  <div className="text-xs text-gray-700 font-medium">AI Assistant • Recommendation System • Predictive Model</div>
                </div>
              ) : program.id === 'program-04' ? (
                <div className="text-xs text-gray-600 bg-purple-50/50 p-3 rounded-xl border border-purple-100 mb-4">
                  * Eligible participants may be considered for internship opportunities based on performance and evaluation.
                </div>
              ) : null}

              {/* Bottom Footer Row: Badge Info on Left, CTA Button on Right */}
              <div className="pt-3 border-t border-gray-200/80 mt-auto flex items-center justify-between gap-3">
                {getProgramBadge(index)}

                <button 
                  onClick={(e) => handleProgramClick(program, e)}
                  className="inline-flex items-center justify-center px-4 py-2 bg-transparent text-emerald-600 text-xs sm:text-sm font-semibold rounded-lg border border-emerald-600 hover:bg-emerald-50/40 transition-all duration-200 ml-auto group/btn cursor-pointer whitespace-nowrap"
                >
                  <span>{program.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Program Detail Interactive Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-4 pr-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {selectedProgram.duration}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    VMANOUS AI SUMMIT
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-vmanous-navy-deep">
                  {selectedProgram.title}
                </h3>
                {selectedProgram.detail?.subtitle && (
                  <p className="text-xs font-semibold text-emerald-600 mt-1 uppercase tracking-wide">
                    {selectedProgram.detail.subtitle}
                  </p>
                )}
              </div>

              {/* Overview */}
              <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Program Overview
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {selectedProgram.detail?.fullOverview || selectedProgram.description}
                </p>
              </div>

              {/* Modules / Key Curriculum */}
              {selectedProgram.detail?.modules && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    Key Learning Modules
                  </h4>
                  <div className="space-y-2">
                    {selectedProgram.detail.modules.map((mod, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-gray-700 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outcomes */}
              {selectedProgram.detail?.outcomes && (
                <div className="mb-6 p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Expected Outcomes</div>
                    <div className="text-xs text-emerald-800 font-medium leading-relaxed mt-0.5">
                      {selectedProgram.detail.outcomes}
                    </div>
                  </div>
                </div>
              )}

              {/* Action CTAs in a single line with reduced border radius */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => {
                    const link = selectedProgram.link;
                    setSelectedProgram(null);
                    setTimeout(() => scrollToSection(link), 150);
                  }}
                  className="w-full py-2.5 sm:py-3 px-2.5 sm:px-4 bg-transparent border border-emerald-600 text-emerald-600 hover:bg-emerald-50/40 text-[11px] xs:text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap overflow-hidden"
                >
                  <span className="hidden sm:inline">Explore Section on Page</span>
                  <span className="inline sm:hidden">Explore Section</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    setTimeout(() => scrollToSection('#registration'), 150);
                  }}
                  className="w-full py-2.5 sm:py-3 px-2.5 sm:px-4 bg-transparent border border-vmanous-navy-deep text-vmanous-navy-deep hover:bg-slate-100/60 text-[11px] xs:text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap overflow-hidden"
                >
                  <span className="hidden sm:inline">Register for Summit</span>
                  <span className="inline sm:hidden">Register Now</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

