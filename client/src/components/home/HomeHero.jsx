import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import imgCollege from '../../assets/images/home/vmanous-college-workshop.jpg';
import imgSummit from '../../assets/images/home/vmanous-ai-summit.webp';
import imgResearch from '../../assets/images/home/vmanous-research-development.webp';
import imgData from '../../assets/images/home/vmanous-data-science.webp';
import imgInternship from '../../assets/images/home/vmanous-ai-internship.webp';

const heroSlides = [
  {
    image: imgCollege,
    eyebrow: "AI • DATA SCIENCE • COLLEGE WORKSHOPS",
    heading: "Bringing Practical AI Summit to Campuses",
    description: "VMANOUS partners with colleges to conduct practical AI and Data Science workshops, helping students explore emerging technologies through hands-on learning.",
    primaryCTA: "Explore Workshops",
    secondaryCTA: "For Colleges"
  },
  {
    image: imgSummit,
    eyebrow: "VMANOUS AI SUMMIT",
    heading: "Explore the Future of Artificial Intelligence",
    description: "Experience Artificial Intelligence, Machine Learning, Generative AI and emerging technologies through an immersive VMANOUS AI Summit.",
    primaryCTA: "Explore AI Summit",
    secondaryCTA: "Learn More"
  },
  {
    image: imgResearch,
    eyebrow: "RESEARCH & DEVELOPMENT",
    heading: "Turn Ideas Into Real AI Research",
    description: "VMANOUS encourages students to explore real-world AI problems, experiment with emerging technologies and develop practical research-driven solutions.",
    primaryCTA: "Explore Research",
    secondaryCTA: "Learn More"
  },
  {
    image: imgData,
    eyebrow: "DATA SCIENCE • ANALYTICS",
    heading: "Build Skills With Real Data",
    description: "Learn Python, Data Analytics, Machine Learning, visualization and practical Data Science through projects and real-world problem solving.",
    primaryCTA: "Explore Data Science",
    secondaryCTA: "View Programs"
  },
  {
    image: imgInternship,
    eyebrow: "AI & DATA SCIENCE INTERNSHIPS",
    heading: "From Learning to Industry Experience",
    description: "Eligible students can progress from workshops and projects to practical AI and Data Science internship opportunities based on performance, evaluation and available opportunities.",
    primaryCTA: "Explore Opportunities",
    secondaryCTA: "Learn More"
  }
];

export const HomeHero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const current = heroSlides[activeSlide];

  return (
    <section
      className="relative min-h-[75vh] md:min-h-[85vh] flex items-end pt-24 pb-20 overflow-hidden bg-[#050816]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* FULL SCREEN BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide + '-img'}
            src={current.image}
            alt={current.heading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050816]/60 via-[#050816]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full mb-4 px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="max-w-4xl text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide + '-text'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="text-xs font-medium tracking-widest text-white uppercase">
                  {current.eyebrow}
                </span>
              </div>

              <h1
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
                className="text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4 tracking-wide"
              >
                {current.heading}
              </h1>

              <p
                style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
                className="text-lg md:text-xl text-gray-300 mb-2 leading-relaxed max-w-2xl"
              >
                {current.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* INDICATORS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 items-center z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === index
              ? 'bg-vmanous-green w-8'
              : 'bg-white/30 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
