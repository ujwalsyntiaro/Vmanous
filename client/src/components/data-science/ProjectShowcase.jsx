import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { dataScienceProjects } from '../../constants/dataScience';
import { ChevronRight } from 'lucide-react';

const ProjectShowcase = () => {
  return (
    <section className="py-16 bg-vmanous-light">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium text-vmanous-navy-deep mb-6">
            Learn by Building
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Apply theoretical knowledge to real-world scenarios through comprehensive practical projects.
          </p>
          <p className="text-sm text-vmanous-ai-blue font-medium tracking-wider">
            SAMPLE PROJECTS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataScienceProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <ChevronRight size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-lg md:text-xl font-medium text-vmanous-navy-deep pr-4">
                    {project.title}
                  </h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-5 leading-snug text-sm">
                  {project.description}
                </p>
                
                <div className="mb-5">
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map(tool => (
                      <span key={tool} className="px-2 py-1 bg-vmanous-ai-blue/10 text-vmanous-ai-blue rounded-md text-xs font-medium">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Skills Acquired
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-md text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProjectShowcase;
