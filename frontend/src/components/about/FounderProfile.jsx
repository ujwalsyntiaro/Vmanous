import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import arjunMadhav from '../../assets/arjun madhav.png';

const FounderProfile = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="bg-white pt-2 md:pt-4 pb-6 md:pb-12 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-start">
          {/* Left Side: 50% Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full flex justify-center lg:justify-start"
          >
            <div className="w-full max-w-md lg:max-w-none rounded-[24px] overflow-hidden bg-[#F7F9FC] shadow-sm">
              <img
                src={arjunMadhav}
                alt="Arjun Madhav - Co-Founder of VMANOUS"
                className="w-full h-auto object-cover block"
              />
            </div>
          </motion.div>

          {/* Right Side: 50% All Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex flex-col justify-start text-left pt-2 sm:pt-2 lg:pt-20"
          >
            {/* Header Text inside Right 50% Section */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-2xl  text-[#0f172a] mb-1 leading-tight">
                Meet Our Leadership
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Visionary guidance for the AI age
              </p>
            </div>

            <div className="space-y-3 text-[14px] text-[#475569] leading-relaxed mb-4">
              <div className="border-l-4 border-gray-200 pl-4 py-1 mb-5 text-[16px]  text-[#0f172a]">
                As the Co-Founder of VMANOUS, I am passionate about building intelligent, scalable, and future-ready technology solutions that empower businesses to innovate, automate, and grow.
              </div>
              <p>
                Driven by a deep passion for technology and education, Arjun envisions an ecosystem where theoretical knowledge seamlessly transitions into practical implementation, particularly within the rapidly evolving fields of Artificial Intelligence and Machine Learning.
              </p>
              <p>
                At VMANOUS, he is focused on advancing student development through cutting-edge AI and hands-on research. By fostering innovation and practical learning, he aims to equip the next generation of tech talent with industry readiness, bridging the gap between academia and real-world AI technology demands.
              </p>
              <p>
                With a strong background in software engineering and artificial intelligence, Arjun has worked on various cutting-edge projects—including deep learning architectures, computer vision applications, and NLP systems—helping bridge the divide between theoretical algorithms and scalable{' '}
                {!isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-[#10b981] font-medium hover:text-[#059669] transition-colors focus:outline-none inline"
                  >
                    Read More
                  </button>
                )}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline"
                    >
                      industry solutions. His dedication to mentorship and education stems from a belief that the right guidance can empower students to solve some of the world's most complex challenges using intelligent AI approaches.
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-[#10b981] font-medium hover:text-[#059669] transition-colors ml-1.5 focus:outline-none inline"
                      >
                        Read Less
                      </button>
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
            </div>

            <hr className="border-gray-100 mb-5" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-4">
              <div>
                <h3 className="text-lg lg:text-xl text-[#0f172a] mb-0.5 leading-tight">
                  Arjun Madhav
                </h3>
                <p className="text-[#10b981] font-bold tracking-[0.15em] text-[9px] uppercase mb-0">
                  CO-FOUNDER, VMANOUS
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/arjunmadhav/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A66C2] hover:opacity-85 transition-opacity inline-flex items-center justify-center"
                  aria-label="LinkedIn Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href="mailto:am@vmanous.com"
                  className="text-[#64748b] hover:text-[#0f172a] transition-colors inline-flex items-center justify-center"
                  aria-label="Email Contact"
                >
                  <Mail className="w-[30px] h-[30px]" strokeWidth={1.8} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderProfile;
