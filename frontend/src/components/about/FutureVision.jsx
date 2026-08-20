import React from 'react';
import Container from '../ui/Container';
import { futureVision } from '../../constants/about';
import { ArrowRight, ArrowDown } from 'lucide-react';

const FutureVision = () => {
  return (
    <section className="py-12 md:py-16 bg-[#050816] text-white">
      <Container className="text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6">{futureVision.heading}</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          {futureVision.text}
        </p>
        
        {/* Horizontal */}
        <div className="hidden md:flex justify-center items-center gap-6">
          {futureVision.flow.map((item, i) => (
            <React.Fragment key={i}>
              <div className="text-xl font-medium tracking-wide text-gray-200">{item}</div>
              {i < futureVision.flow.length - 1 && <ArrowRight className="text-blue-500 opacity-50" />}
            </React.Fragment>
          ))}
        </div>

        {/* Vertical */}
        <div className="flex md:hidden flex-col items-center gap-4">
          {futureVision.flow.map((item, i) => (
            <React.Fragment key={i}>
              <div className="text-xl font-medium tracking-wide text-gray-200">{item}</div>
              {i < futureVision.flow.length - 1 && <ArrowDown className="text-blue-500 opacity-50 h-5" />}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FutureVision;
