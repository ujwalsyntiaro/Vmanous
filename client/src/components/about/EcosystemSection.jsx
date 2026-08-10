import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { ecosystem } from '../../constants/about';
import { Target, BookOpen, Database, Code, Lightbulb, Briefcase, Award } from 'lucide-react';

const icons = { Target, BookOpen, Database, Code, Lightbulb, Briefcase, Award };

const EcosystemSection = () => {
  return (
    <section className="py-12 md:py-16 bg-vmanous-navy-dark text-white overflow-hidden">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">{ecosystem.heading}</h2>
        </div>
        
        <div className="relative max-w-5xl mx-auto py-10">
          <div className="flex flex-wrap justify-center gap-6">
            <div className="w-full flex justify-center mb-8">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-1 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                <div className="w-full h-full bg-vmanous-navy-dark rounded-full flex items-center justify-center font-medium text-2xl tracking-widest">
                  VMANOUS
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {ecosystem.nodes.map((node, i) => {
                const Icon = icons[node.icon] || Code;
                return (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-[#0a0e24] border border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center"
                  >
                    <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl mb-4">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-semibold mb-2">{node.title}</h3>
                    <p className="text-sm text-gray-400">{node.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EcosystemSection;
