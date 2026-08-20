import React from 'react';
import Container from '../ui/Container';
import { whatWeDo } from '../../constants/about';

const WhatWeDo = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep">{whatWeDo.heading}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatWeDo.cards.map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-medium text-xl mb-6">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-10">
          *Internship pathways depend on eligibility and performance.
        </p>
      </Container>
    </section>
  );
};

export default WhatWeDo;
