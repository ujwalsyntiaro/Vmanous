import React from 'react';
import Container from '../ui/Container';

export const CaseStudiesImpact = ({ metrics }) => {
  return (
    <section className="relative z-20 -mt-8 sm:-mt-10 mb-4 sm:mb-10">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-center items-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-vmanous-green mb-1">
                {item.value}
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm text-gray-500 font-medium leading-tight">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
