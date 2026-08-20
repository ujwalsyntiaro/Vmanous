import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const ProjectShowcase = ({ projects }) => {
  return (
    <section className="py-8 md:py-10 bg-white relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            Don't Just Learn AI.<br className="hidden md:block" />
            <span className="text-vmanous-ai-blue">Build With It.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full group"
            >
              <div className="h-64 sm:h-72 lg:h-72 relative overflow-hidden bg-gray-100 rounded-b-lg">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-b-lg group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                  Example Project
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium text-vmanous-ai-blue uppercase tracking-wider">{project.type}</span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{project.difficulty}</span>
                </div>

                <h3 className="text-xl md:text-2xl md: font-medium text-vmanous-navy-deep mb-4 leading-tight">{project.title}</h3>

                <div className="mt-auto pt-4 border-t border-gray-50">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.map(tool => (
                      <span key={tool} className="px-2 py-1 bg-blue-50 text-vmanous-ai-blue rounded text-[10px] font-medium tracking-wider uppercase">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/ai-summit"
            className="inline-flex justify-center items-center px-8 py-4 border border-vmanous-green text-vmanous-navy-dark font-medium rounded-lg hover:ring-1 hover:ring-vmanous-green transition-all group"
          >
            Explore Learning Options
            <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </div>
      </Container>
    </section>
  );
};
