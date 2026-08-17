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

const UPCOMING_SUMMITS = [
  {
    id: 1,
    title: "AI Summit 2026",
    college: "National Institute of Technology",
    date: "August 25, 2026",
    time: "10:00 AM - 4:00 PM",
    type: "Flagship Event"
  },
  {
    id: 2,
    title: "AI Summit 2026",
    college: "Indian Institute of Technology",
    date: "September 10, 2026",
    time: "9:00 AM - 5:00 PM",
    type: "Flagship Event"
  },
  {
    id: 3,
    title: "AI Summit 2026",
    college: "Delhi Technological University",
    date: "September 25, 2026",
    time: "10:00 AM - 4:00 PM",
    type: "Flagship Event"
  }
];

const PROGRAM_OPTIONS = [
  { value: 'AI Summit', label: 'AI Summit' },
  { value: 'AI Research Lab', label: 'AI Research & Project Lab' },
  { value: 'College Campus Workshop', label: 'College Campus Partnership Program' },
  { value: 'Mentorship & Training', label: 'Expert Mentorship & Training' }
];

export const Enroll = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    branch: '',
    year: '',
    institution: '',
    programInterest: 'AI Summit',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleRegisterClick = (summit) => {
    setShowForm(true);
    setFormData(prev => ({ ...prev, programInterest: summit.title }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/payment', { state: { formData } });
    }, 1200);
  };

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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                Upcoming Programs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {UPCOMING_SUMMITS.map((summit, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={summit.id}
                  className="bg-white rounded-2xl border border-[#16A34A]/20 shadow-lg p-6 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#16A34A]/5 rounded-bl-full pointer-events-none" />

                  <div className="flex-1 relative z-10">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {summit.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-4">{summit.title}</h3>

                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{summit.college}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-[#16A34A] flex-shrink-0" />
                        <span>{summit.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} className="text-[#16A34A] flex-shrink-0" />
                        <span>{summit.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 relative z-10">
                    <button
                      onClick={() => handleRegisterClick(summit)}
                      className="w-full px-6 py-2.5 bg-transparent border-2 border-[#16A34A] text-[#16A34A] text-sm font-bold rounded-xl hover:bg-[#16A34A]/10 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      Register Now
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 04 INTERACTIVE APPLICATION FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="w-full relative overflow-hidden">
              {/* Form Header */}
              <div className="bg-white text-[#0F172A] p-6 md:p-8 border-b border-gray-100 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
                      Application Form
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                      Applying for:
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] text-xs font-bold uppercase tracking-wider">
                        {formData.programInterest}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 md:p-10 bg-white">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-16 h-16 bg-green-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-slate-600 max-w-md mx-auto mb-6 text-sm leading-relaxed">
                      Thank you for applying to join the VMANOUS ecosystem. Our team will review your details and reach out within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          alternatePhone: '',
                          branch: '',
                          year: '',
                          institution: '',
                          programInterest: 'AI Summit',
                          message: ''
                        });
                      }}
                      className="px-6 py-3 bg-[#16A34A] text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md"
                    >
                      Submit Another Response
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          placeholder="Rahul Sharma"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="rahul@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>

                      {/* Alternate Phone */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Alternate Phone Number
                        </label>
                        <input
                          type="tel"
                          name="alternatePhone"
                          placeholder="+91 98765 43210"
                          value={formData.alternatePhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Institution / College */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          College Name & Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="institution"
                          required
                          placeholder="National Institute of Technology"
                          value={formData.institution}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
                        />
                      </div>

                      {/* Branch */}
                      <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Branch / Specialization
                          </label>
                          <select
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 appearance-none"
                          >
                            <option value="" disabled>Select Branch</option>
                            <option value="Computer Science Engineering (CSE)">Computer Science Engineering (CSE)</option>
                            <option value="Information Technology (IT)">Information Technology (IT)</option>
                            <option value="Electronics and Communication (ECE)">Electronics and Communication (ECE)</option>
                            <option value="Electrical and Electronics (EEE)">Electrical and Electronics (EEE)</option>
                            <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
                            <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                            <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                            <option value="MCA">MCA</option>
                            <option value="BCA">BCA</option>
                            <option value="BSc">BSc</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                    </div>

                    {/* Program Focus and Year */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Year of Study (Conditionally Rendered) */}
                      {formData.branch && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Year of Study
                          </label>
                          <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 appearance-none"
                          >
                            <option value="" disabled>Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Completed / Alumni">Completed / Alumni</option>
                          </select>
                        </div>
                      )}

                      {/* Program Focus */}
                      <div className={`relative ${(!formData.branch || activeRole !== 'college') ? 'md:col-span-2' : ''}`}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Program / Track Interest
                        </label>

                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 cursor-pointer flex items-center justify-between"
                        >
                          <span className={formData.programInterest ? 'text-[#16A34A] font-medium' : 'text-slate-800'}>
                            {PROGRAM_OPTIONS.find(o => o.value === formData.programInterest)?.label || formData.programInterest}
                          </span>
                          <ChevronDown size={18} className={`text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#16A34A]' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden py-1 z-30">
                            {PROGRAM_OPTIONS.map((opt) => {
                              const isSelected = formData.programInterest === opt.value;
                              return (
                                <button
                                  type="button"
                                  key={opt.value}
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, programInterest: opt.value }));
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isSelected
                                    ? 'bg-emerald-50/80 text-[#16A34A] font-bold'
                                    : 'text-slate-700 hover:bg-emerald-50/50 hover:text-[#16A34A]'
                                    }`}
                                >
                                  <span>{opt.label}</span>
                                  {isSelected && <CheckCircle2 size={16} className="text-[#16A34A]" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Additional Details / Statement of Purpose
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        placeholder="Tell us about your learning goals or institutional requirements..."
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal resize-none"
                      />
                    </div>

                    {/* Submit Button CTA */}
                    <div className="pt-2 flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-auto px-10 py-3.5 bg-transparent border-2 border-gray-200 hover:border-[#16A34A] text-slate-700 hover:text-[#16A34A] font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-sm group cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span className="inline-block animate-pulse">Redirecting to Payment...</span>
                        ) : (
                          <>
                            <span>Proceed to Payment</span>
                            <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
