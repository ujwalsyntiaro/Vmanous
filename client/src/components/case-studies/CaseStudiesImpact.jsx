import React from 'react';
import Container from '../ui/Container';

export const CaseStudiesImpact = ({ metrics }) => {
  return (
    <section className="relative z-20 -mt-10 mb-12">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-3xl md:text-4xl font-semibold text-vmanous-green mb-1">
                {item.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
