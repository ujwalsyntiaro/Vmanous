import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Sparkles, 
  Database, 
  BarChart3, 
  Code2, 
  Microscope, 
  ScanEye, 
  MessageSquareText 
} from 'lucide-react';

const focusAreas = [
  { icon: BrainCircuit, title: "AI & Machine Learning", desc: "Building intelligent systems that learn and adapt." },
  { icon: Sparkles, title: "Generative AI", desc: "Exploring the creative power of modern AI models." },
  { icon: Database, title: "Data Science", desc: "Extracting meaningful insights from complex datasets." },
  { icon: BarChart3, title: "Data Analytics", desc: "Transforming raw data into actionable business intelligence." },
  { icon: Code2, title: "Python & Applied Programming", desc: "Practical coding skills for real-world AI applications." },
  { icon: Microscope, title: "AI Research", desc: "Pushing boundaries in artificial intelligence innovation." },
  { icon: ScanEye, title: "Computer Vision", desc: "Teaching machines to interpret and understand visual data." },
  { icon: MessageSquareText, title: "Natural Language Processing", desc: "Enabling computers to process and analyze human language." }
];

const FocusAreas = () => {
  return (
    <section className="bg-white pt-2 pb-4 md:pt-4 md:pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-medium text-[#050816]">
            Our Areas of Focus
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          {focusAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group p-3.5 xs:p-4 sm:p-5 bg-[#F7F9FC] border border-gray-100 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="text-[#2563EB] mb-2 sm:mb-4 group-hover:scale-110 transition-all duration-300 inline-flex">
                  <area.icon size={22} strokeWidth={1.5} className="sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm xs:text-base font-medium text-[#050816] mb-1 sm:mb-2 leading-snug">
                  {area.title}
                </h3>
              </div>
              <p className="text-gray-500 text-[11px] xs:text-xs leading-snug">
                {area.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusAreas;
