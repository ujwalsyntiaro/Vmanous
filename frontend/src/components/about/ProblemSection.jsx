import React from 'react';
import Container from '../ui/Container';
import { problem } from '../../constants/about';
import { ArrowDown, Plus } from 'lucide-react';

const ProblemSection = () => {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep">{problem.heading}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Traditional */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-8 text-center">Traditional Learning</h3>
            <div className="flex flex-col items-center gap-4">
              {problem.traditional.map((item, i) => (
                <React.Fragment key={i}>
                  <div className="w-full bg-white p-4 text-center rounded-lg shadow-sm text-gray-600">{item}</div>
                  {i < problem.traditional.length - 1 && <ArrowDown className="text-gray-300" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* VMANOUS Approach */}
          <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-vmanous-ai-blue text-white text-xs font-medium px-4 py-1 rounded-full uppercase tracking-wider">
              The VMANOUS Way
            </div>
            <h3 className="text-xl font-semibold text-vmanous-ai-blue mb-8 text-center mt-2">VMANOUS Approach</h3>
            <div className="flex flex-col items-center gap-3">
              {problem.vmanous.map((item, i) => (
                <React.Fragment key={i}>
                  <div className="w-full bg-white border border-blue-100 p-3 text-center rounded-lg shadow-sm text-vmanous-navy-deep font-medium">{item}</div>
                  {i < problem.vmanous.length - 1 && <ArrowDown className="text-blue-200 h-4" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Career Prep */}
          <div className="bg-green-50/50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-xl font-semibold text-vmanous-green mb-8 text-center">Career Preparation</h3>
            <div className="flex flex-col items-center gap-4">
              {problem.career.map((item, i) => (
                <React.Fragment key={i}>
                  <div className="w-full bg-white border border-green-100 p-4 text-center rounded-lg shadow-sm text-gray-800 font-medium">{item}</div>
                  {i < problem.career.length - 1 && <Plus className="text-green-300" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProblemSection;
