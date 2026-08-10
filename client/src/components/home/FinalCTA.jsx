import React from 'react';
import Container from '../ui/Container';

const FinalCTA = () => {
  return (
    <section className="relative py-32 bg-vmanous-navy-dark overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/images/network.jpg" 
          alt="AI Network Background" 
          className="w-full h-full object-cover mix-blend-screen"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-vmanous-navy-dark via-transparent to-vmanous-navy-dark opacity-90"></div>
      
      <Container className="relative z-10 text-center">
        <h2 className="text-2xl md:text-4xl md: md:text-xl font-medium text-white mb-6">Your AI Journey Starts Here.</h2>
        <p className="text-xl md:text-2xl text-vmanous-ai-blue font-light mb-12">Learn. Build. Research. Experience.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="w-full sm:w-auto px-10 py-4 bg-vmanous-green text-white font-medium rounded-xl hover:bg-vmanous-green-hover transition-colors shadow-xl shadow-vmanous-green/20">
            Explore Workshops
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm">
            For Colleges
          </button>
        </div>
      </Container>
    </section>
  );
};

export default FinalCTA;
