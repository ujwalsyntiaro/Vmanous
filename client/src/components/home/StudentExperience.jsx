import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

const StudentExperience = () => {
  return (
    <section className="py-12 md:py-16 bg-vmanous-light overflow-hidden">
      <Container>
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl md: md:text-xl font-medium text-vmanous-navy-deep mb-6">Built for the Next Generation of AI Talent</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm border border-gray-100">Hands-on Learning</span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm border border-gray-100">Expert Mentors</span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm border border-gray-100">Research Exposure</span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 shadow-sm border border-gray-100">Internship Opportunities</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative"
            >
              <div className="text-vmanous-green mb-6">
                <svg className="w-10 h-10 opacity-40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-lg text-gray-700 italic mb-8 relative z-10">
                "VMANOUS helped me move from understanding AI concepts to actually building projects. The transition into a real research internship was seamless."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?img=${index + 10}`} alt="Student" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl md: font-medium text-vmanous-navy-deep">Student Name</h4>
                  <p className="text-sm text-gray-500">AI & Data Science Cohort</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StudentExperience;
