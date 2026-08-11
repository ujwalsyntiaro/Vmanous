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
    <section className="bg-[#F7F9FC] py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <span className="text-[#3B82F6] font-semibold tracking-wider text-sm uppercase mb-3 block">
            How We Work
          </span>
          <h2 className="text-3xl md:text-4xl font-medium text-[#050816]">
            From Learning to Industry Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-[24px] border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="text-5xl font-light text-gray-200 mb-6 group-hover:text-[#3B82F6]/20 transition-colors">
                {step.number}
              </div>
              <h3 className="text-2xl font-medium text-[#050816] mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
