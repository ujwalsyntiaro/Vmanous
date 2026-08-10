import React from 'react';
import Container from '../ui/Container';

export const SummitRegistration = ({ registration }) => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#080B1A] to-[#12162A] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-gray-800">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-vmanous-ai-blue/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row gap-8 items-center justify-between">
              <div>
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-widest text-white mb-4 border border-white/10 uppercase">
                  Registration
                </div>
                <h2 className="text-2xl md:text-4xl md: text-xl font-medium text-white mb-4">
                  VMANOUS AI Summit 2026
                </h2>
                
                <ul className="text-gray-300 space-y-2 mb-6">
                  <li className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-vmanous-ai-blue" /> AI Foundations & ML (5 Days)
                  </li>
                  <li className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Research & Development (10 Days)
                  </li>
                  <li className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-vmanous-green" /> Internship Pathway (1–3 Months)
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center min-w-[250px]">
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Registration Fee</div>
                <div className="text-2xl font-medium text-white mb-6">
                  {registration.fee === 'TBD' ? 'Coming Soon' : registration.fee}
                </div>
                <button 
                  disabled
                  className="w-full py-4 bg-white/10 text-white/50 font-medium rounded-xl cursor-not-allowed border border-white/5"
                >
                  Registration Opening Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
