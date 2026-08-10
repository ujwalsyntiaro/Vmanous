import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, TestTube, Briefcase } from 'lucide-react';
import Container from '../ui/Container';

export const SummitOverview = () => {
  const cards = [
    { num: "01", icon: BookOpen, title: "Learn", desc: "Build strong Artificial Intelligence foundations." },
    { num: "02", icon: Compass, title: "Explore", desc: "Discover emerging technologies and tools." },
    { num: "03", icon: TestTube, title: "Research", desc: "Work on real-world AI problems." },
    { num: "04", icon: Briefcase, title: "Experience", desc: "Gain practical exposure through projects and industry interaction." }
  ];

  return (
    <section className="py-24 bg-[#080B1A] text-white border-t border-white/5">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl md: md:text-xl font-medium mb-6">One Summit.<br /><span className="text-vmanous-ai-electric font-light">Multiple AI Experiences.</span></h2>
          <p className="text-xl text-gray-400">
            VMANOUS AI Summit brings together structured learning, practical experimentation, research and industry exposure in one student-focused experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <card.icon className="w-8 h-8 text-vmanous-ai-blue" />
                <span className="text-2xl font-semibold text-white/10">{card.num}</span>
              </div>
              <h3 className="text-xl md:text-2xl md: text-xl font-medium mb-3 text-white">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const SummitJourney = ({ journey }) => {
  return (
    <section className="py-24 bg-white">
      <Container>
        <h2 className="text-2xl md:text-4xl md: md:text-xl font-medium text-[#050816] mb-16 text-center">Your AI Summit Journey</h2>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line Desktop */}
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gray-200"></div>
          
          <div className="flex flex-col md:flex-row justify-between relative z-10 gap-10 md:gap-0">
            {journey.map((step, idx) => (
              <div key={idx} className="flex flex-row md:flex-col items-center md:items-center w-full md:w-48 group relative">
                {/* Connecting Line Mobile */}
                {idx !== journey.length - 1 && (
                  <div className="md:hidden absolute left-10 top-20 bottom-[-40px] w-0.5 bg-gray-200"></div>
                )}
                
                <div className="w-20 h-20 rounded-full bg-white border-4 border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 z-10 mr-6 md:mr-0 md:mb-6 group-hover:border-vmanous-ai-blue transition-colors duration-300">
                  <span className="text-lg font-medium text-gray-500 group-hover:text-vmanous-ai-blue">0{idx + 1}</span>
                </div>
                
                <div className="text-left md:text-center">
                  <h4 className="text-lg md:text-xl md: text-lg font-medium text-[#050816] mb-1">{step.title}</h4>
                  <p className="text-sm font-semibold text-vmanous-green">{step.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 italic">
            * Internship opportunities may be available based on eligibility, evaluation and program requirements.
          </p>
        </div>
      </Container>
    </section>
  );
};
