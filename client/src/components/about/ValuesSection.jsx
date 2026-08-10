import React from 'react';
import Container from '../ui/Container';
import { values } from '../../constants/about';
import { Wrench, Zap, Search, Shield, Book } from 'lucide-react';

const icons = { Wrench, Zap, Search, Shield, Book };

const ValuesSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-vmanous-navy-deep">{values.heading}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {values.list.map((v, i) => {
            const Icon = icons[v.icon] || Book;
            return (
              <div key={i} className="flex flex-col items-center text-center max-w-[160px]">
                <div className="w-14 h-14 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-700 mb-4">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ValuesSection;
