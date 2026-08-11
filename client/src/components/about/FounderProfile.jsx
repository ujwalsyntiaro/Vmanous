import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import arjunMadhav from '../../assets/arjun madhav.png';

const FounderProfile = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white py-24 md:py-32 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:mb-24 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-medium text-[#050816]">
            Leadership
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center md:items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-64 md:w-80 shrink-0"
          >
            <div className="rounded-[24px] overflow-hidden bg-[#F7F9FC] shadow-sm">
              <img
                src={arjunMadhav}
                alt="Arjun Madhav - Co-Founder of VMANOUS"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex flex-col justify-center text-left"
          >
            <h3 className="text-4xl lg:text-5xl font-semibold text-[#0f172a] mb-3">
              Arjun Madhav
            </h3>
            <p className="text-[#10b981] font-bold tracking-[0.15em] text-[13px] uppercase mb-8">
              CO-FOUNDER, VMANOUS
            </p>

            <div className="space-y-6 text-[17px] text-[#475569] leading-[1.7] mb-4">
              <p>
                Driven by a deep passion for technology and education, Arjun envisions an ecosystem where theoretical knowledge seamlessly transitions into practical implementation.
              </p>
              <p>
                At VMANOUS, he is focused on advancing student development through AI, Data Science, and hands-on research. By fostering innovation and practical learning, he aims to equip the next generation of tech talent with industry readiness, bridging the gap between academia and real-world technology demands.
              </p>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <p>
                      With a strong background in software engineering and artificial intelligence, Arjun has worked on various cutting-edge projects, helping bridge the divide between theoretical algorithms and scalable industry solutions.
                    </p>
                    <p>
                      His dedication to mentorship and education stems from a belief that the right guidance can empower students to solve some of the world's most complex challenges using data-driven approaches.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#10b981] font-medium hover:text-[#059669] transition-colors mb-10 w-fit focus:outline-none"
            >
              {isExpanded ? 'Read Less -' : 'Read More +'}
            </button>

            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.linkedin.com/in/arjunmadhav/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                aria-label="LinkedIn Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="mailto:contact@vmanous.com"
                className="text-[#64748b] hover:opacity-80 transition-opacity ml-1"
                aria-label="Email Contact"
              >
                <div className="w-[36px] h-[36px] rounded bg-transparent flex items-center justify-center">
                  <Mail size={22} strokeWidth={2.5} className="text-[#64748b]" />
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderProfile;
