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
    <section className="bg-white pt-2 pb-12 md:pt-4 md:pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-medium text-[#050816]">
            The Principles Behind VMANOUS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100 shadow-sm hover:bg-white hover:border-[#16A34A]/40 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] flex items-center justify-center text-[#050816]">
                  <value.icon size={20} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-light text-gray-200">{value.number}</span>
              </div>
              <h3 className="text-lg font-medium text-[#050816] mb-2">
                {value.title}
              </h3>
              <p className="text-gray-500 leading-relaxed text-xs">
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
