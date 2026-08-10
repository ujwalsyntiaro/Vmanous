import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

export const SummitAudience = () => {
  const audiences = [
    "Computer Science Students",
    "Engineering Students",
    "AI & ML Learners",
    "AI Enthusiasts",
    "Students Interested in Research",
    "Students Building AI Projects"
  ];
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-[#050816] relative overflow-hidden">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl md: text-xl md:text-xl font-medium text-white mb-6">
            Built for the Next Generation of AI Talent
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {audiences.map((aud, i) => (
            <motion.div
              key={aud}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-colors"
            >
              {aud}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const CertificateShowcase = () => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-white relative">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl md: text-xl md:text-xl font-medium text-vmanous-navy-deep mb-6">
              Complete the Journey. Earn Your Certificate.
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Participants who successfully complete the applicable program requirements and assessment criteria may receive a VMANOUS certificate.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-2xl transform rotate-3 scale-105 -z-10" />
            <div className="bg-white border-8 border-gray-50 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="text-center mb-8">
                <div className="text-vmanous-ai-blue font-medium text-xl tracking-widest mb-1">VMANOUS</div>
                <div className="text-gray-400 text-xs tracking-widest uppercase">Certificate of Completion</div>
              </div>
              <div className="text-center mb-10">
                <div className="text-sm text-gray-500 mb-2">This is to certify that</div>
                <div className="text-xl font-serif text-vmanous-navy-deep mb-2">[ Participant Name ]</div>
                <div className="text-sm text-gray-500 max-w-sm mx-auto">has successfully completed the VMANOUS AI Summit 2026.</div>
              </div>
              <div className="flex justify-between items-end">
                <div className="w-24 h-px bg-gray-300 relative"><span className="absolute -bottom-5 left-0 text-[10px] text-gray-400">Date</span></div>
                <div className="w-16 h-16 rounded-full border-4 border-vmanous-ai-blue/20 flex items-center justify-center text-vmanous-ai-blue/30 font-medium transform -rotate-12">SEAL</div>
                <div className="w-24 h-px bg-gray-300 relative"><span className="absolute -bottom-5 left-0 text-[10px] text-gray-400">Director</span></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export const SummitFAQ = ({ faq }) => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-vmanous-light">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl md: text-xl md:text-xl font-medium text-vmanous-navy-deep mb-6">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faq.map((item, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center font-medium text-vmanous-navy-deep hover:text-vmanous-ai-blue transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {item.q}
                <ChevronDown size={20} className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export const SummitCTA = () => {
  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-[#050816] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-vmanous-ai-blue/10 rounded-full blur-[120px]" />
      </div>
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center border border-white/10 bg-white/5 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-2xl">
          <h2 className="text-2xl md:text-4xl md: md:text-xl font-medium text-white mb-6">
            Build. Research. Innovate With AI.
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start your journey from AI fundamentals to practical projects, research and industry experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/enroll" className="px-8 py-4 bg-vmanous-ai-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25">
              Register for AI Summit
            </Link>
            <Link to="/data-science" className="px-8 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              Explore Data Science
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
