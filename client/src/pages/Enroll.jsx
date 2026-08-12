import React, { useState, useEffect } from 'react';
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
  Briefcase
} from 'lucide-react';
import Container from '../components/ui/Container';
import { ENROLLMENT_FAQS } from '../constants/enrollment';

// Role Options Config
const ROLES = [
  {
    id: 'college',
    title: 'College Partnership',
    subtitle: 'For educational institutions',
    badge: 'INSTITUTIONAL',
    color: 'green',
    icon: Building2,
    description: 'Bring structured AI and Data Science programs, research labs, and practical workshops to your campus.',
    highlights: [
      'On-campus AI & Data Science Labs',
      'Structured student development',
      'Faculty orientation & industry alignment',
      'Institutional MOU & Certifications'
    ]
  },
  {
    id: 'trainer',
    title: 'Trainer / Mentor',
    subtitle: 'For industry experts',
    badge: 'MENTORSHIP',
    color: 'purple',
    icon: UserCheck,
    description: 'Join VMANOUS as an expert mentor to conduct workshops, guide research, and evaluate student projects.',
    highlights: [
      'Conduct expert-led masterclasses',
      'Mentor top student projects',
      'Flexible engagement models',
      'Professional ecosystem network'
    ]
  },
  {
    id: 'organization',
    title: 'Organization',
    subtitle: 'For businesses and startups',
    badge: 'CORPORATE',
    color: 'blue',
    icon: Briefcase,
    description: 'Partner with VMANOUS for corporate training, talent acquisition, and AI project consulting.',
    highlights: [
      'Corporate AI & Data Science training',
      'Hire top-trained student talent',
      'Collaborative R&D projects',
      'Exclusive industry networking'
    ]
  }
];

export const Enroll = () => {
  const [activeRole, setActiveRole] = useState('college');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    programInterest: 'AI Summit & Data Science',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);

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
      setIsSubmitted(true);
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
              className="text-2xl md:text-4xl lg:text-5xl text-white tracking-wide mb-3 leading-tight"
            >
              Take the First Step Into the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vmanous-green via-teal-400 to-vmanous-ai-blue">
                VMANOUS Ecosystem
              </span>
            </h1>

            <p
              style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300 }}
              className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4"
            >
              Select your pathway to join our AI & Data Science ecosystem — whether as a forward-thinking college partner or expert mentor.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* 02 ROLE SELECTION CARDS */}
      <section className="relative z-20 -mt-8 mb-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ROLES.map((role) => {
              const IconComponent = role.icon;
              const isSelected = activeRole === role.id;
              return (
                <motion.div
                  key={role.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveRole(role.id)}
                  className={`cursor-pointer bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${isSelected
                      ? 'border-vmanous-green shadow-xl ring-2 ring-vmanous-green/20'
                      : 'border-gray-200 shadow-sm hover:shadow-md'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${isSelected ? 'bg-vmanous-green/10 text-vmanous-green' : 'bg-gray-100 text-gray-700'}`}>
                        <IconComponent size={24} />
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600 uppercase tracking-wider">
                        {role.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-vmanous-navy-dark mb-1">
                      {role.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mb-3">{role.subtitle}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {role.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {role.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 size={15} className="text-vmanous-green flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRole(role.id);
                      document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${isSelected
                        ? 'bg-vmanous-green text-white shadow-md shadow-green-500/20'
                        : 'bg-gray-100 text-vmanous-navy-dark hover:bg-gray-200'
                      }`}
                  >
                    Select & Apply
                    <ArrowRight size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 03 INTERACTIVE APPLICATION FORM */}
      <section id="enrollment-form" className="py-8 mb-12">
        <Container>
          <div className="max-w-3xl mx-auto bg-white border border-gray-200/80 shadow-2xl overflow-hidden relative">
            {/* Form Header */}
            <div className="bg-white text-[#0F172A] p-6 md:p-8 border-b border-gray-100 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#16A34A]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
                    Application Form
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                    Applying as:
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] text-xs font-bold uppercase tracking-wider">
                      {ROLES.find(r => r.id === activeRole)?.title}
                    </span>
                  </p>
                </div>

                {/* Form Role Selector Segmented Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setActiveRole(r.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${activeRole === r.id
                          ? 'bg-[#16A34A] text-white shadow-md shadow-green-600/20'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                        }`}
                    >
                      {r.id.toUpperCase()}
                    </button>
                  ))}
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
                        institution: '',
                        programInterest: 'AI Summit & Data Science',
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
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
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
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
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
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* Institution / College / Company */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        {activeRole === 'college' ? 'College Name & Location' : 'Organization / Current Company'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="institution"
                        required
                        placeholder={activeRole === 'college' ? 'e.g. National Institute of Technology' : 'e.g. Current Company / Designation'}
                        value={formData.institution}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                  </div>

                  {/* Program Focus */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Program / Track Interest
                    </label>
                    <select
                      name="programInterest"
                      value={formData.programInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="AI Summit & Data Science">AI Summit & Data Science Ecosystem</option>
                      <option value="AI Research Lab">AI Research & Project Lab</option>
                      <option value="College Campus Workshop">College Campus Partnership Program</option>
                      <option value="Mentorship & Training">Expert Mentorship & Training</option>
                    </select>
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
                      className="w-full px-4 py-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/15 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal resize-none"
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
                        <span className="inline-block animate-pulse">Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <Send size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
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
