import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';

const DataScienceCTA = () => {
  return (
    <section className="py-12 md:py-16 bg-[#050816] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-vmanous-ai-blue/20 rounded-full blur-[150px]" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center border border-white/10 bg-white/5 backdrop-blur-sm p-12 md:p-20 rounded-3xl shadow-2xl">
          <h2 className="text-2xl md:text-4xl md: md:text-xl font-medium text-white mb-6">
            Start Your Data Science Journey
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Learn the tools. Understand the data. Build intelligent solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/enroll" 
              className="px-8 py-4 bg-vmanous-ai-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-vmanous-ai-blue/25 text-lg"
            >
              Get Started
            </Link>
            <Link 
              to="/ai-summit" 
              className="px-8 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-lg backdrop-blur-sm"
            >
              Explore AI Summit
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DataScienceCTA;
