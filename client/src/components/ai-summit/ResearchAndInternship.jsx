import React from 'react';
import Container from '../ui/Container';
import { motion } from 'framer-motion';
import { Search, BarChart2, FlaskConical, Lightbulb, ArrowDown } from 'lucide-react';

export const ResearchLab = ({ image }) => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <img src={image} alt="Research Laboratory" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white font-medium">
                "AI Research Laboratory"
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
              Think Beyond the Classroom
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Explore AI through experimentation, data, research and practical problem solving in an immersive environment.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Search, title: 'Research Thinking' },
                { icon: BarChart2, title: 'Data Analysis' },
                { icon: FlaskConical, title: 'Experimentation' },
                { icon: Lightbulb, title: 'Innovation' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-vmanous-light p-4 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-vmanous-ai-blue flex items-center justify-center shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div className="font-medium text-vmanous-navy-deep">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
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
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-gradient-to-br from-[#050816] to-[#0A102A] relative overflow-hidden">
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
