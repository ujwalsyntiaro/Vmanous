import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import arjunMadhav from '../assets/arjun madhav.png';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const ecosystemFlow = [
    "COLLEGES",
    "WORKSHOPS",
    "PRACTICAL LEARNING",
    "PROJECTS",
    "RESEARCH",
    "EVALUATION",
    "INTERNSHIP",
    "CAREER OPPORTUNITIES"
  ];

  return (
    <main className="w-full min-h-screen bg-[#F7F9FC] font-sans text-[#050816] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        
        {/* ABOUT CONTENT SECTION */}
        <section className="px-6 py-16 md:px-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                Company Profile
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#050816] leading-tight mb-12">
              About VMANOUS
            </h1>
            
            <div className="prose prose-lg md:prose-xl max-w-none text-gray-600 space-y-8">
              <p className="text-xl md:text-2xl font-medium text-[#080B1A] leading-relaxed">
                VMANOUS is an AI and Data Science education, research, and industry-readiness platform.
              </p>
              
              <p className="leading-relaxed">
                Operating at the intersection of AI, Data Science, Education, Research, and Industry, we are dedicated to building practical, future-ready AI and Data Science talent. We collaborate closely with colleges to conduct specialized AI and Data Science workshops, empowering students to move beyond theoretical learning toward practical execution.
              </p>
              
              <div className="bg-[#F7F9FC] rounded-2xl p-8 md:p-10 my-12 border border-gray-100">
                <h3 className="text-sm font-bold tracking-widest text-[#050816] uppercase mb-8">Our Focus Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base md:text-lg">
                  {[
                    "AI Education",
                    "Data Science",
                    "Machine Learning",
                    "Generative AI",
                    "Practical Workshops",
                    "College AI Programs",
                    "Research & Development",
                    "Student Projects",
                    "Industry Exposure",
                    "AI/Data Science Internships",
                    "Career Opportunities"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                      <span className="font-medium text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="leading-relaxed">
                By guiding students through hands-on projects, research experience, and internship opportunities, we ensure they are fully equipped to solve complex problems and thrive in real-world technology environments.
              </p>
            </div>
            
            {/* ECOSYSTEM FLOW */}
            <div className="mt-16 pt-16 border-t border-gray-100">
              <h3 className="text-sm font-bold tracking-widest text-[#050816] uppercase mb-10 text-center">
                The VMANOUS Ecosystem
              </h3>
              <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-3 md:gap-4">
                {ecosystemFlow.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-[#080B1A] shadow-sm tracking-wide">
                      {step}
                    </div>
                    {index < ecosystemFlow.length - 1 && (
                      <ArrowRight className="text-gray-300 rotate-90 md:rotate-0" size={20} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
          </motion.div>
        </section>

        <div className="w-full h-px bg-gray-100" />

        {/* FOUNDER SECTION */}
        <section className="px-6 py-16 md:px-16 md:py-24 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-16"
          >
            <div className="w-48 md:w-64 shrink-0">
              <img 
                src={arjunMadhav} 
                alt="Arjun Madhav - Co-Founder" 
                className="w-full h-auto object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-8">
              <h2 className="text-3xl md:text-4xl font-medium text-[#050816] mb-2">
                Arjun Madhav
              </h2>
              <p className="text-sm font-bold tracking-widest text-[#16A34A] uppercase mb-8">
                CO-FOUNDER, VMANOUS
              </p>
              
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.linkedin.com/in/arjunmadhav/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0A66C2] hover:border-[#0A66C2] transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a 
                  href="mailto:contact@vmanous.com" 
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#16A34A] hover:border-[#16A34A] transition-colors"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </main>
  );
};

export default About;
