import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';

export const SummitPrograms = ({ programs }) => {
  return (
    <section id="programs" className="pt-4 md:pt-6 pb-4 md:pb-6 bg-vmanous-light">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-deep mb-6">
            Inside the AI Summit
          </h2>
          <p className="text-lg text-gray-600">
            A structured progression of programs designed to build knowledge, experience, and industry readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-xs font-medium text-vmanous-ai-blue tracking-widest uppercase">
                  Program 0{index + 1}
                </div>
                <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {program.duration}
                </div>
              </div>
              
              <h3 className="text-xl md:text-2xl font-medium text-vmanous-navy-deep mb-4">
                {program.title}
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {program.description}
              </p>
              
              <div className="mb-10 flex-grow">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Focus Areas
                </div>
                <div className="flex flex-wrap gap-2">
                  {program.topics.map(topic => (
                    <span key={topic} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              {program.id === 'program-03' ? (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <div className="text-xs font-medium text-vmanous-ai-blue uppercase tracking-wider mb-2">Example Projects</div>
                  <div className="text-sm text-gray-700 font-medium">AI Assistant • Recommendation System • Predictive Model</div>
                </div>
              ) : program.id === 'program-04' ? (
                <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-xl">
                  * Eligible participants may be considered for internship opportunities based on performance, evaluation and available opportunities.
                </div>
              ) : (
                <Link 
                  to={program.link} 
                  className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-vmanous-navy-deep text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  {program.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
