import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Send,
  ShieldCheck,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import Container from '../components/ui/Container';
import { ENROLLMENT_FAQS } from '../constants/enrollment';
import { getSummits } from '../services/summitService';

const PROGRAM_OPTIONS = [
  { value: 'AI Summit', label: 'AI Summit' },
  { value: 'AI Research Lab', label: 'AI Research & Project Lab' },
  { value: 'College Campus Workshop', label: 'College Campus Partnership Program' },
  { value: 'Mentorship & Training', label: 'Expert Mentorship & Training' }
];

export const Enroll = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [upcomingSummits, setUpcomingSummits] = useState([]);

  const handleRegisterClick = (summit) => {
    navigate('/application', { state: { programInterest: summit.title, summitDetails: summit } });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setUpcomingSummits(getSummits());
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 01 HERO BANNER */}
      <section className="relative h-[200px] sm:h-[260px] md:min-h-[35vh] flex items-center pt-10 pb-4 md:pt-20 md:pb-16 overflow-hidden bg-[#050816] text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/network.jpg"
            alt="Network background"
            className="w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-[#050816]/70 to-[#050816]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-vmanous-green/15 rounded-full blur-[140px]" />
        </div>

        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
              <Sparkles size={14} className="text-vmanous-green animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-vmanous-green uppercase">
                ENROLLMENT HUB • VMANOUS
              </span>
            </div>

            <h1
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-2xl md:text-4xl lg:text-5xl text-white tracking-wide mb-2 leading-tight"
            >
              Take the First Step Into the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-green via-teal-400 to-vmanous-ai-blue">
                VMANOUS Ecosystem
              </span>
            </h1>
          </motion.div>
        </Container>
      </section>



      {/* 03 UPCOMING AI SUMMITS */}
      <section id="upcoming-summits" className="py-8 bg-gray-50/50">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                Upcoming Programs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingSummits.map((summit, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={summit.id}
                  className="rounded-lg shadow-xl p-6 md:p-8 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-[100px] pointer-events-none" />

                  <div className="flex-1 relative z-10">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="bg-gray-200 text-black text-[11px] font-medium px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-gray-300">
                        {summit.type}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-medium text-black mb-1 leading-tight">
                      {summit.title}
                    </h3>
                    <p className="text-xs font-normal text-black mb-2 uppercase tracking-widest">
                      {summit.college}
                    </p>
                    <h4 className="text-lg md:text-xl font-medium text-black mb-1 tracking-tight">
                      {summit.duration} &bull; <span className="text-black font-normal text-base md:text-lg">{summit.date}</span>
                    </h4>
                    <p className="text-base font-normal text-black mb-6 tracking-wide">
                      {summit.subtitle}
                    </p>

                    <div className="space-y-4 mb-8 mt-6">
                      {summit.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-black">
                          <div className="bg-[#2D73B4] rounded-full p-0.5">
                            <CheckCircle2 size={16} className="text-white flex-shrink-0" />
                          </div>
                          <span className="font-normal text-xs md:text-sm tracking-wide">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-200 relative z-10">
                    <button
                      onClick={() => handleRegisterClick(summit)}
                      className="w-full px-6 py-3.5 bg-[#2D73B4] text-white text-base font-bold rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 hover:-translate-y-1 shadow-lg"
                    >
                      Register Now
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>


      {/* 04 ECOSYSTEM WORKFLOW TIMELINE */}
      <section className="py-10 bg-white border-y border-gray-200">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-vmanous-navy-dark mb-2">
              How Enrollment Works
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              A transparent, outcome-oriented workflow designed for maximum practical growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Submit Application', desc: 'Select your role and submit the enrollment form with your details.' },
              { num: '02', title: 'Orientation & Review', desc: 'Our academic team reviews your profile and completes onboarding.' },
              { num: '03', title: 'Hands-on Learning', desc: 'Engage in AI Summit programs, project labs, and data science workflows.' },
              { num: '04', title: 'Evaluation & Pathways', desc: 'Gain skill certifications, research exposure, and internship pathways.' }
            ].map((step, idx) => (
              <div key={idx} className="relative p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-2xl font-black text-vmanous-green mb-2">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-vmanous-navy-dark mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>


    </div>
  );
};

export default Enroll;
