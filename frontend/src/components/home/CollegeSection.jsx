import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Container from '../ui/Container';

const CollegeSection = () => {
  const benefits = [
    "Industry-focused curriculum",
    "Expert mentors",
    "Hands-on projects",
    "Student assessment",
    "Internship opportunities",
    "Certificates"
  ];

  return (
    <section className="py-12 md:py-16 bg-vmanous-navy-dark text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-vmanous-ai-blue/10 to-transparent hidden lg:block"></div>
      
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 relative z-10">
            <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-semibold mb-6 border border-white/20">
              For Educational Institutions
            </div>
            <h2 className="text-2xl md:text-4xl md: md:text-xl font-medium mb-6 leading-tight">
              Bring Industry-Level AI Learning to Your Campus.
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              VMANOUS partners with colleges to deliver practical AI and Data Science workshops designed around real industry skills.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-vmanous-green flex-shrink-0" />
                  <span className="text-gray-200 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
            
            <button className="px-8 py-4 bg-white text-vmanous-navy-dark font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-xl">
              Partner With VMANOUS
            </button>
          </div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 relative z-10"
          >
            <div className="rounded-none overflow-hidden shadow-2xl border border-white/10 relative group">
              <div className="absolute inset-0 bg-vmanous-ai-blue/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src="/images/college.jpg" 
                alt="College Workshop" 
                className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};

export default CollegeSection;
