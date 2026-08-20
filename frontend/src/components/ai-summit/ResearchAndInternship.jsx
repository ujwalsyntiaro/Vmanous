import React, { useState } from 'react';
import Container from '../ui/Container';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BarChart2, FlaskConical, Lightbulb, ArrowDown, ChevronRight, Sparkles, X, CheckCircle2 } from 'lucide-react';

export const ResearchLab = ({ image }) => {
  const [selectedPillar, setSelectedPillar] = useState(null);

  const researchPillars = [
    { 
      icon: Search, 
      title: 'Research Thinking', 
      subtitle: 'Structured Methodology',
      description: 'Learn to formulate hypotheses, analyze state-of-the-art literature, define scope, and structure AI experiments with rigorous scientific methodologies.',
      highlights: ['Hypothesis Formulation', 'Literature Benchmarking', 'Experiment Architecture', 'Paper & Report Drafting']
    },
    { 
      icon: BarChart2, 
      title: 'Data Analysis', 
      subtitle: 'Pattern & Insights',
      description: 'Extract deep signals from structured and unstructured datasets using exploratory analysis, statistical modeling, and automated feature extraction pipelines.',
      highlights: ['Exploratory Data Analysis', 'Statistical Modeling', 'Feature Engineering', 'Data Visualization']
    },
    { 
      icon: FlaskConical, 
      title: 'Experimentation', 
      subtitle: 'Iterative Model Testing',
      description: 'Train and evaluate deep learning architectures, track metrics across iterations, and optimize hyperparameters for peak accuracy and generalization.',
      highlights: ['Loss & Gradient Optimization', 'Model Benchmarking', 'Hyperparameter Tuning', 'A/B Testing']
    },
    { 
      icon: Lightbulb, 
      title: 'Innovation', 
      subtitle: 'Novel AI Solutions',
      description: 'Transform experimental models into production-ready AI services with APIs, real-time inference pipelines, and scalable cloud deployment.',
      highlights: ['Custom Model Architectures', 'API Endpoint Deployment', 'Inference Latency Optimization', 'Real-world AI Prototypes']
    }
  ];

  return (
    <section id="research-lab" className="py-8 md:py-14 bg-white relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="relative h-[320px] sm:h-[400px] md:h-[480px] rounded-lg md:rounded-xl overflow-hidden shadow-2xl">
            <img src={image} alt="Research Laboratory" className="w-full h-full object-cover rounded-lg md:rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white font-medium">
                "AI Research Laboratory"
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-3 sm:mb-4">
              Think Beyond the Classroom
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Explore AI through experimentation, data, research and practical problem solving in an immersive environment.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full mb-5 sm:mb-6">
              {researchPillars.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedPillar(item)}
                  className="w-full flex items-center justify-between gap-3 bg-slate-50/90 p-3.5 sm:p-4 rounded-lg border border-slate-200/80 hover:border-emerald-500 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50/80 border border-emerald-100 text-gray-500 group-hover:text-emerald-600 group-hover:border-emerald-200 flex items-center justify-center shrink-0 transition-all duration-300">
                      <item.icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-vmanous-navy-deep group-hover:text-emerald-600 transition-colors leading-snug truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-slate-100 text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 flex items-center justify-center shrink-0 transition-all">
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Research Metrics & Highlights Bar */}
            <div className="p-4 sm:p-5 rounded-lg bg-slate-50/90 text-vmanous-navy-deep border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-vmanous-navy-deep leading-snug">
                    Research-Driven AI Environment
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-tight">
                    Hands-on GPU compute lab, paper reviews & model deployment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-5 shrink-0 w-full sm:w-auto justify-around">
                <div className="text-center">
                  <span className="block text-base sm:text-lg font-extrabold text-emerald-600">50+</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Prototypes</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="block text-base sm:text-lg font-extrabold text-teal-600">1:1</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Mentorship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Interactive Detail Modal */}
      <AnimatePresence>
        {selectedPillar && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPillar(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedPillar(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                  <selectedPillar.icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-vmanous-navy-deep">{selectedPillar.title}</h3>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{selectedPillar.subtitle}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {selectedPillar.description}
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Focus Areas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedPillar.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPillar(null)}
                className="w-full py-3 bg-transparent border border-emerald-500 text-emerald-600 hover:border-2 hover:border-emerald-600 hover:font-bold text-sm font-medium rounded-lg transition-all cursor-pointer"
              >
                Close Detail View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export const InternshipPathwayVisual = () => {
  const steps = [
    "AI Summit",
    "Practical Project",
    "Evaluation",
    "Research",
    "Internship Opportunity",
    "Career Growth"
  ];
  return (
    <section id="internship-pathway" className="pt-4 md:pt-6 pb-4 md:pb-6 bg-gradient-to-br from-[#050816] to-[#0A102A] relative overflow-hidden">
      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-medium text-white mb-6">
            Learning Can Lead to Experience
          </h2>
          <p className="text-lg text-gray-400">
            Strong-performing participants may be considered for internship opportunities based on eligibility, evaluation and available opportunities.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`px-4 py-4 rounded-xl text-center flex-1 w-full md:w-auto shadow-lg font-medium text-sm md:text-xs lg:text-sm border ${index === steps.length - 2 ? 'bg-vmanous-green/20 text-vmanous-green border-vmanous-green/30' : 'bg-white/10 text-white border-white/10 backdrop-blur-md'}`}
              >
                {step}
              </motion.div>
              {index < steps.length - 1 && (
                <div className="text-gray-500 md:-rotate-90 md:mx-0">
                  <ArrowDown size={24} className="md:hidden" />
                  <ArrowDown size={24} className="hidden md:block transform -rotate-90" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};
