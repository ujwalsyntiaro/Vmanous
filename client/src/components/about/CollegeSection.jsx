import React from 'react';
import { motion } from 'framer-motion';

const CollegeSection = () => {
  return (
    <section className="bg-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#050816] mb-8 leading-tight">
              Bringing Industry-Relevant AI Learning to Colleges
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              VMANOUS works with colleges to deliver structured AI and Data Science workshops that give students exposure to emerging technologies, practical tools and real-world applications.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "College Workshops",
                "AI Summit Programs",
                "Practical Sessions",
                "Expert Mentorship",
                "Student Projects",
                "Research Exposure",
                "Internship Pathways"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span className="text-[#080B1A] font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#2563EB]/10 to-[#16A34A]/10 rounded-[32px] transform translate-x-4 translate-y-4 -z-10" />
            <div className="rounded-[32px] overflow-hidden border border-gray-100 shadow-2xl relative bg-gray-50 aspect-[4/3]">
              {/* Note: Placeholder image representing an Indian college AI workshop. */}
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" 
                alt="Indian college students in an AI workshop" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CollegeSection;
