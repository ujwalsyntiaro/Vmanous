import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Learn",
    description: "AI & Data Science fundamentals through practical workshops.",
  },
  {
    number: "02",
    title: "Build",
    description: "Students work on hands-on projects and real-world problems.",
  },
  {
    number: "03",
    title: "Research",
    description: "Students explore AI research, experimentation and innovation.",
  },
  {
    number: "04",
    title: "Evaluate",
    description: "Projects, skills and practical understanding are evaluated.",
  },
  {
    number: "05",
    title: "Internship",
    description: "High-performing students get opportunities for AI/Data Science internship experiences.",
  },
  {
    number: "06",
    title: "Grow",
    description: "Students build stronger portfolios and career readiness.",
  }
];

const ApproachTimeline = () => {
  return (
    <section className="bg-white py-4 md:py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5 md:mb-6 text-center md:text-left">
          <span className="text-[#16A34A] font-semibold tracking-wider text-xs uppercase mb-1 block">
            How We Work
          </span>
          <h2 className="text-xl md:text-2xl font-medium text-[#050816]">
            From Learning to Industry Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#F8FAFC] p-4 border border-gray-100 hover:bg-white hover:border-[#16A34A]/40 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="text-3xl font-light text-gray-300 mb-2 group-hover:text-[#16A34A] transition-colors duration-300">
                {step.number}
              </div>
              <h3 className="text-lg font-medium text-[#050816] mb-1">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-snug text-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachTimeline;
