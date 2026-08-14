import React from 'react';

export const SummitRegistration = ({ registration }) => {
  return (
    <section id="registration" className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <div className="w-full px-0 sm:px-6 lg:px-8 max-w-full sm:max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#080B1A] to-[#12162A] rounded-none p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden border border-gray-800">
          
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-vmanous-ai-blue/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

          <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium tracking-widest text-white mb-4 border border-white/10 uppercase">
                Registration
              </div>
              <h2 className="text-2xl md:text-4xl md:text-xl font-medium text-white mb-4">
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
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-none p-6 sm:p-8 text-center min-w-[280px] sm:min-w-[320px] w-full md:w-auto">
              <div className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Registration Fee</div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-6">
                {registration.fee === 'TBD' ? 'Coming Soon' : registration.fee}
              </div>
              <div 
                className="w-full px-6 py-3.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-inner tracking-wide"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span>Registration Opening Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
