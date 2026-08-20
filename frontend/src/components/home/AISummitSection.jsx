import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

const AISummitSection = () => {
  return (
    <section className="py-12 md:py-16 bg-vmanous-navy-deep text-white relative overflow-hidden">
      {/* Abstract Background element */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3/4 h-[800px] bg-vmanous-ai-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl md:text-4xl md: text-xl md: font-medium mb-4 tracking-tight">VMANOUS AI Summit</h2>
            <h3 className="text-xl md:text-2xl md: md:text-xl text-vmanous-ai-blue font-light mb-8">Learn. Research. Experience.</h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl font-medium text-vmanous-ai-blue">01</div>
                <div>
                  <h4 className="text-lg md:text-xl md: text-xl font-semibold mb-1">AI & Data Science Workshop</h4>
                  <p className="text-gray-400">Intensive hands-on training focusing on practical skills.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl font-medium text-vmanous-ai-purple">02</div>
                <div>
                  <h4 className="text-lg md:text-xl md: text-xl font-semibold mb-1">Research & Development</h4>
                  <p className="text-gray-400">Collaborative research projects targeting real-world problems.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl font-medium text-vmanous-green">03</div>
                <div>
                  <h4 className="text-lg md:text-xl md: text-xl font-semibold mb-1">Industry Internship</h4>
                  <p className="text-gray-400">Direct pathways to internships based on summit performance.</p>
                </div>
              </div>
            </div>
            
            <button className="px-8 py-4 bg-vmanous-ai-blue text-white font-medium rounded-xl hover:bg-vmanous-ai-electric transition-colors shadow-lg shadow-vmanous-ai-blue/20">
              Explore AI Summit
            </button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-vmanous-navy-dark/40 to-transparent mix-blend-overlay z-10"></div>
              <img 
                src="/images/summit.jpg" 
                alt="AI Summit" 
                className="w-full h-[500px] object-cover"
              />
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};

export default AISummitSection;
