import React from 'react';
import { motion } from 'framer-motion';

const AboutIntroduction = () => {
  return (
    <section className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-medium text-[#050816] mb-10 leading-tight">
            Empowering Students Through AI, Data & Innovation
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed font-light">
            <p>
              VMANOUS works with colleges to conduct practical AI and Data Science workshops designed to introduce students to real-world technology.
            </p>
            <p>
              Students move beyond theoretical learning through hands-on activities, projects, research exposure and industry-oriented experiences.
            </p>
            <p>
              Our ecosystem connects education with practical implementation, research and internship opportunities.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutIntroduction;
