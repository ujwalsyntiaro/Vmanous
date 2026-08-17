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
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  key={summit.id}
                  className="bg-white rounded-md border border-slate-200/80 shadow-md p-6 md:p-7 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 group"
                >
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                  <div className="flex-1 relative z-10">
                    {/* Event Type Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {summit.type}
                      </span>
                    </div>

                    {/* Title & College */}
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2 tracking-tight">
                      {summit.title}
                    </h3>

                    {/* Light Highlighted College Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] tracking-wider uppercase mb-4 shadow-2xs">
                      <Building2 size={13} className="text-emerald-600 flex-shrink-0" />
                      <span>{summit.college}</span>
                    </div>

                    {/* Schedule & Highlighted Date Box */}
                    <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200/60 mb-4 flex items-center justify-between gap-2 flex-wrap shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-emerald-600 text-white shadow-2xs">
                          <Calendar size={14} />
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 tracking-tight">{summit.duration}</span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 shadow-2xs">
                        {summit.date}
                      </span>
                    </div>

                    {/* Subtitle / Objective */}
                    <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed mb-6">
                      {summit.subtitle}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2.5 mb-3 pt-2 border-t border-slate-100">
                      {summit.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="p-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mt-0.5 flex-shrink-0">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-xs md:text-sm font-medium text-slate-700 leading-snug">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="mt-auto pt-2 border-t border-slate-100 relative z-10">
                    <button
                      onClick={() => handleRegisterClick(summit)}
                      className="w-full px-5 py-3.5 bg-transparent border-2 border-emerald-600 text-emerald-600 font-bold rounded-md hover:border-[3px] hover:border-emerald-700 hover:text-emerald-700 hover:shadow-md transition-all duration-150 flex items-center justify-center gap-2 text-sm cursor-pointer group/btn"
                    >
                      <span>Register Now</span>
                      <ArrowRight size={18} className="transform group-hover/btn:translate-x-1 transition-transform" />
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
