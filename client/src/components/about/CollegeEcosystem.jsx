import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import { collegeProgram } from '../../constants/about';
import { ArrowDown, ArrowRight } from 'lucide-react';

const CollegeEcosystem = () => {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-gray-100">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep mb-6">
              {collegeProgram.heading}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {collegeProgram.description}
            </p>
            <Link to="/enroll" className="inline-block px-8 py-4 border border-vmanous-green text-vmanous-navy-dark rounded-xl font-medium hover:bg-vmanous-green hover:text-white transition-colors">
              Partner With VMANOUS
            </Link>
          </div>
          
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex flex-col items-center justify-center">
            {/* Desktop horizontal flow */}
            <div className="hidden md:flex flex-wrap items-center justify-center gap-4">
              {collegeProgram.steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="px-5 py-3 bg-white rounded-xl shadow-sm text-vmanous-navy-deep font-semibold">
                    {step}
                  </div>
                  {i < collegeProgram.steps.length - 1 && <ArrowRight className="text-blue-300" />}
                </React.Fragment>
              ))}
            </div>
            {/* Mobile vertical flow */}
            <div className="flex md:hidden flex-col items-center gap-3">
              {collegeProgram.steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="w-full min-w-[200px] text-center px-5 py-3 bg-white rounded-xl shadow-sm text-vmanous-navy-deep font-semibold">
                    {step}
                  </div>
                  {i < collegeProgram.steps.length - 1 && <ArrowDown className="text-blue-300 h-5" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CollegeEcosystem;
