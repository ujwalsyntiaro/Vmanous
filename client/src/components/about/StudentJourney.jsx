import React from 'react';
import Container from '../ui/Container';
import { studentJourney } from '../../constants/about';
import { ArrowRight, ArrowDown } from 'lucide-react';

const StudentJourney = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep">{studentJourney.heading}</h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Desktop horizontal */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-y-8 gap-x-2">
            {studentJourney.timeline.map((step, i) => (
              <React.Fragment key={i}>
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-vmanous-navy-light text-center whitespace-nowrap">
                  {step}
                </div>
                {i < studentJourney.timeline.length - 1 && (
                  <ArrowRight className="text-gray-300 w-5 h-5 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile vertical */}
          <div className="flex md:hidden flex-col items-center gap-3">
            {studentJourney.timeline.map((step, i) => (
              <React.Fragment key={i}>
                <div className="w-full max-w-[280px] py-3 bg-white rounded-lg shadow-sm border border-gray-200 font-medium text-vmanous-navy-light text-center">
                  {step}
                </div>
                {i < studentJourney.timeline.length - 1 && (
                  <ArrowDown className="text-gray-300 h-5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-12 max-w-2xl mx-auto">
          *{studentJourney.disclaimer}
        </p>
      </Container>
    </section>
  );
};

export default StudentJourney;
