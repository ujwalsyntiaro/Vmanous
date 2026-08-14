import React from 'react';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import aiSummitImg from '../../assets/images/home/2nd section on home page.png';

export const AISummitFeature = () => {
  return (
    <section className="pt-2 md:pt-4 pb-0 md:pb-4 bg-white relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[0.75fr_1.25fr] gap-12 lg:gap-16 items-start">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div className="self-start px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-semibold text-vmanous-ai-blue tracking-widest uppercase mb-6">
              Flagship Program
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-vmanous-navy-dark mb-2 sm:mb-3">
              VMANOUS AI Summit
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-vmanous-ai-blue to-purple-600 font-medium mb-4 sm:mb-6">
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
                <span className="w-2.5 h-2.5 rounded-full bg-vmanous-green" /> Internship Pathway
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> AI Innovation
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Research & Development
              </li>
            </ul>

            <Link
              to="/ai-summit"
              className="inline-flex justify-center items-center px-8 py-4 border border-vmanous-green text-vmanous-navy-dark font-medium rounded-xl hover:ring-1 hover:ring-vmanous-green transition-all group self-start"
            >
              Explore AI Summit
              <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-auto rounded-[24px] overflow-hidden shadow-xl flex items-center justify-center bg-gray-50"
          >
            <img
              src={aiSummitImg}
              alt="VMANOUS AI Summit"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
