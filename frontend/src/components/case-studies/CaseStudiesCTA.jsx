import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';

export const CaseStudiesCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-[#050816] text-white relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-vmanous-ai-blue/15 rounded-full blur-[130px]" />
      </div>

      <Container className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto border border-white/10 bg-white/5 backdrop-blur-md p-10 md:p-16 rounded-3xl shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-medium text-white mb-6">
            Ready to Unlock Business Impact?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
            Let's build customized AI models, data analytics dashboards, and automated operational pipelines tailored to your enterprise.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/enroll"
              className="w-full sm:w-auto px-8 py-4 bg-vmanous-green text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/25"
            >
              Get Started
            </Link>
            <Link
              to="/data-science"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20 backdrop-blur-sm"
            >
              Explore Data Science
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
