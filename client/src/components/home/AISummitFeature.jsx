import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const AISummitFeature = () => {
  return (
    <section className="py-6 md:py-8 bg-white relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-vmanous-ai-blue tracking-widest uppercase mb-6">
              Flagship Program
            </div>

            <h2 className="text-3xl md:text-4xl font-medium text-vmanous-navy-dark mb-3">
              VMANOUS AI Summit
            </h2>
            <h3 className="text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-vmanous-ai-blue to-purple-600 font-medium mb-6">
              Where Students Build With AI.
            </h3>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              An immersive AI and Data Science experience combining practical learning, innovation, research and industry-focused projects.
            </p>

            <ul className="space-y-4 mb-10 text-gray-700 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-vmanous-ai-blue" /> AI Workshop
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Research & Development
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> AI Innovation
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-vmanous-green" /> Internship Pathway
              </li>
            </ul>

            <Link
              to="/ai-summit"
              className="inline-flex justify-center items-center px-8 py-4 border border-vmanous-green text-vmanous-navy-dark font-medium rounded-xl hover:bg-vmanous-green hover:text-white transition-all group"
            >
              Explore AI Summit
              <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-gray-100"
          >
            <img
              src="/images/ai-summit/hero.jpg"
              alt="AI Summit"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
