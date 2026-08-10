import React from 'react';
import Container from '../ui/Container';
import { founder } from '../../constants/about';

const FounderSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            {/* Professional Portrait */}
            <div className="w-full md:w-5/12 shrink-0">
              <div className="relative aspect-square max-w-sm mx-auto w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2 border border-gray-100">
                <img 
                  src={founder.image} 
                  alt={`${founder.name} — ${founder.role}`} 
                  className="relative z-10 w-full h-full object-cover object-top rounded-xl bg-gray-50/50"
                />
              </div>
            </div>
            
            {/* Biography */}
            <div className="w-full md:w-7/12 flex flex-col justify-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-vmanous-ai-blue text-sm font-semibold mb-6 border border-blue-100 w-max">
                {founder.heading}
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold text-vmanous-navy-deep mb-2">{founder.name}</h2>
              <h3 className="text-xl text-vmanous-green font-medium mb-8 flex items-center gap-2">
                <div className="w-8 h-[2px] bg-vmanous-green rounded-full"></div>
                {founder.role}
              </h3>
              <div className="prose prose-lg text-gray-600">
                <p className="leading-relaxed">
                  {founder.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FounderSection;
