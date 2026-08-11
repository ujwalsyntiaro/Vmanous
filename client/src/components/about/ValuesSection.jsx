import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Lightbulb, FlaskConical, Briefcase, GraduationCap, RefreshCw } from 'lucide-react';

const values = [
  {
    number: "01",
    icon: Hammer,
    title: "Practical Learning",
    desc: "Emphasizing hands-on experience and real-world implementation over pure theory."
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Innovation",
    desc: "Fostering creative problem-solving and exploring new frontiers in AI."
  },
  {
    number: "03",
    icon: FlaskConical,
    title: "Research Mindset",
    desc: "Encouraging experimentation, deep analysis, and continuous discovery."
  },
  {
    number: "04",
    icon: Briefcase,
    title: "Industry Relevance",
    desc: "Aligning skills and education with the active demands of the tech sector."
  },
  {
    number: "05",
    icon: GraduationCap,
    title: "Student Growth",
    desc: "Focusing entirely on building capable, confident, and future-ready talent."
  },
  {
    number: "06",
    icon: RefreshCw,
    title: "Continuous Learning",
    desc: "Adapting constantly to the rapidly evolving landscape of technology."
  }
];

const ValuesSection = () => {
  return (
    <section className="bg-[#F7F9FC] py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-20 text-center">
          <h2 className="text-3xl md:text-5xl font-medium text-[#050816]">
            The Principles Behind VMANOUS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#F7F9FC] flex items-center justify-center text-[#050816]">
                  <value.icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-light text-gray-200">{value.number}</span>
              </div>
              <h3 className="text-xl font-medium text-[#050816] mb-3">
                {value.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
