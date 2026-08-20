import React from 'react';
import { motion } from 'framer-motion';

const CollegeSection = () => {
  return (
    <section className="bg-white pt-0 pb-6 md:pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-start gap-3"
          >
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#050816] mb-3 leading-tight">
                Bringing Industry-Relevant AI Learning to Colleges
              </h2>
              <p className="text-base text-gray-600 mb-4 leading-relaxed">
                VMANOUS works with colleges to deliver structured AI and Data Science workshops that give students exposure to emerging technologies, practical tools and real-world applications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 mb-2">
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
                    <div className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
                    <span className="text-sm text-[#080B1A] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Added Info Section */}
            <div className="mt-2 pt-3 border-t border-gray-100">
              {/* Impact Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100 shadow-xs">
                  <div className="text-lg md:text-xl font-bold text-[#050816]">50+</div>
                  <div className="text-[11px] text-gray-500 font-medium">Partner Colleges</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100 shadow-xs">
                  <div className="text-lg md:text-xl font-bold text-[#050816]">10K+</div>
                  <div className="text-[11px] text-gray-500 font-medium">Students Trained</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100 shadow-xs">
                  <div className="text-lg md:text-xl font-bold text-[#16A34A]">100+</div>
                  <div className="text-[11px] text-gray-500 font-medium">Live AI Projects</div>
                </div>
              </div>

              {/* Campus Collaboration Highlight */}
              <div className="bg-gradient-to-r from-emerald-50/80 to-blue-50/80 p-3.5 rounded-xl border border-emerald-100/80 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5">
                    Customized Campus Bootcamps
                  </h4>
                  <p className="text-xs text-gray-600 leading-snug">
                    Tailored AI & Data Science modules with industry-recognized certifications.
                  </p>
                </div>
              </div>
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
            <div className="rounded-2xl overflow-hidden shadow-lg relative bg-gray-50 aspect-[4/3] flex items-center justify-center border border-gray-100">
              <img
                src="/images/about-college-workshop.png"
                alt="Indian college students collaborating in an AI workshop"
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
