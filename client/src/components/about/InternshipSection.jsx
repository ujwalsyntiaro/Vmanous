import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const InternshipSection = () => {
  return (
    <section className="bg-white py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#3B82F6] font-semibold tracking-wider text-sm uppercase mb-3 block">
            Internship Ecosystem
          </span>
          <h2 className="text-3xl md:text-5xl font-medium text-[#050816] mb-4">
            From Practical Learning to Industry Experience
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Workshops are only the beginning. Students who demonstrate strong practical skills, project capability and learning potential can progress toward AI and Data Science internship opportunities.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 bg-[#F7F9FC] p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm">
            {[
              "Workshop",
              "Projects",
              "Evaluation",
              "Internship",
              "Experience"
            ].map((step, index, array) => (
              <React.Fragment key={index}>
                <div className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-base font-semibold text-[#080B1A] shadow-sm w-full md:w-auto">
                  {step}
                </div>
                {index < array.length - 1 && (
                  <ArrowRight className="text-gray-300 hidden md:block" size={24} />
                )}
                {index < array.length - 1 && (
                  <ArrowRight className="text-gray-300 rotate-90 md:hidden my-2" size={24} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InternshipSection;
