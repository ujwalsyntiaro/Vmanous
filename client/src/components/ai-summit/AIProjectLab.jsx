import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { ChevronRight } from 'lucide-react';

export const AIProjectLab = ({ projects }) => {
  return (
    <section className="py-6 md:py-8 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            Build Something Intelligent
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Apply theoretical knowledge to practical scenarios by building real AI applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <ChevronRight size={80} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full whitespace-nowrap uppercase tracking-wider">
                    {project.type}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
                    {project.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-medium text-vmanous-navy-deep mb-6">
                  {project.title}
                </h3>
                
                <div className="mb-6 flex-grow">
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Technology
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map(tool => (
                      <span key={tool} className="text-sm font-medium text-vmanous-ai-blue">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-medium italic">* Example Summit Project</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
