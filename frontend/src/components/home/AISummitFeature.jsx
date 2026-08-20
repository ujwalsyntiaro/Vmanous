import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, User, Mail, Phone, Clock, Users, BookOpen, CheckCircle2, Check, BadgeCheck, ShieldCheck, Send, Shield, Sparkles, Briefcase, GraduationCap, ChevronDown, MessageSquare } from 'lucide-react';
import { saveCollegeRequest } from '../../services/collegeRequestService';

const ROLE_OPTIONS = [
  "Principal / Director",
  "Head of Department (HOD)",
  "Professor / Faculty Member",
  "Training & Placement Officer (TPO)",
  "Dean / Academic Head",
  "Workshop & Event Coordinator",
  "Management / College Authority"
];

const PROGRAM_OPTIONS = [
  { value: "AI SUMMIT WORKSHOP", label: "AI SUMMIT WORKSHOP (Generative AI & Agentic LLMs)" },
  { value: "Workshop Aegentic ai", label: "Workshop Aegentic ai (Full-Stack AI & RAG Architecture)" },
  { value: "Data Science", label: "Data Science (Machine Learning & Deep Learning)" },
  { value: "Custom AI Workshop", label: "Custom AI Workshop (Tailored for College Curriculum)" }
];

export const AISummitFeature = () => {
  const [formData, setFormData] = useState({
    collegeName: '',
    collegeAddress: '',
    repName: '',
    repRole: '',
    email: '',
    phone: '',
    whatsapp: '',
    preferredProgram: 'AI SUMMIT WORKSHOP',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isProgramOpen, setIsProgramOpen] = useState(false);

  const roleDropdownRef = useRef(null);
  const programDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleOpen(false);
      }
      if (programDropdownRef.current && !programDropdownRef.current.contains(event.target)) {
        setIsProgramOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // Contact Number & WhatsApp Number - 10 digits only
    if (name === 'phone' || name === 'whatsapp') {
      val = value.replace(/\D/g, '').slice(0, 10);

      if (val.length > 0 && val.length < 10) {
        setErrors(prev => ({
          ...prev,
          [name]: `${name === 'phone' ? 'Contact' : 'WhatsApp'} number must be exactly 10 digits`
        }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }

    // Official Email Validation
    if (name === 'email') {
      if (val.trim().length > 0 && !emailRegex.test(val.trim())) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, email: null }));
      }
    }

    // Designation / Role Validation
    if (name === 'repRole') {
      if (val.trim().length > 0) {
        setErrors(prev => ({ ...prev, repRole: null }));
      }
    }

    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate Designation / Role
    if (!formData.repRole || formData.repRole.trim() === '') {
      newErrors.repRole = 'Please select your Designation / Role';
    }

    // Validate Official Email
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid official email address';
    }

    // Validate Contact Number (10 digits)
    if (!formData.phone || formData.phone.trim().length !== 10) {
      newErrors.phone = 'Contact number must be 10 digits';
    }

    // Validate WhatsApp Number (10 digits)
    if (!formData.whatsapp || formData.whatsapp.trim().length !== 10) {
      newErrors.whatsapp = 'WhatsApp number must be 10 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const res = await saveCollegeRequest(formData);

    setIsSubmitting(false);
    if (res.success) {
      setIsSubmitted(true);
      setErrors({});
      setFormData({
        collegeName: '',
        collegeAddress: '',
        repName: '',
        repRole: '',
        email: '',
        phone: '',
        whatsapp: '',
        preferredProgram: 'AI SUMMIT WORKSHOP',
        message: ''
      });
    }
  };

  return (
    <section className="pt-6 md:pt-8 pb-2 md:pb-3 bg-slate-50/60 relative border-y border-slate-200/60">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* LEFT ENTERPRISE BRANDING CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-700 tracking-wide">
              <Sparkles size={13} className="text-emerald-600" />
              <span>Campus Academic Partnership</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-medium text-slate-900 leading-[1.15] tracking-tight">
                Host VMANOUS AI Summit At Your College
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Bring industry-grade Artificial Intelligence, Data Science, and RAG Architecture workshops directly to your campus students.
              </p>
            </div>

            {/* Key Deliverables List */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Verified Certifications</h4>
                  <p className="text-xs text-slate-500">Every participant receives an industry-recognized certificate.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">On-Campus Execution</h4>
                  <p className="text-xs text-slate-500">Complete setup, expert speakers & practical GPU lab guidance.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Tailored Academic Curriculum</h4>
                  <p className="text-xs text-slate-500">Customized for B.Tech, MCA & Diploma computer science streams.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Briefcase size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Internship & Hiring Pathways</h4>
                  <p className="text-xs text-slate-500">Top performing students get direct interview calls for AI roles.</p>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <Link
                to="/ai-summit"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors group"
              >
                <span>Learn more about workshop curriculum</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* RIGHT CLEAN & PROFESSIONAL ENTERPRISE FORM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 bg-white rounded-2xl pt-4 px-5 pb-4 sm:pt-4 sm:px-7 sm:pb-4 md:pt-4 md:px-7 md:pb-4 border border-slate-200 shadow-xl shadow-slate-200/50"
          >
            {/* Form Header */}
            <div className="border-b border-slate-100 pb-3.5 mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-medium text-slate-900 tracking-tight">
                  Request AI Workshop Proposal
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Fill in your college details to receive an official proposal & date confirmation.
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md border border-slate-200">
                Official Form
              </span>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200/80 shadow-sm"
                >
                  <ShieldCheck size={38} strokeWidth={1.75} />
                </motion.div>
                <h4 className="text-2xl font-medium text-slate-900">Proposal Request Received</h4>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you! Our Academic Partnerships Director will contact your representative within 24 hours to schedule the workshop.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-white border-2 border-slate-700 text-slate-900 font-bold rounded-xl text-sm hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40 transition-all duration-200 shadow-sm cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Institution Row: College Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      College Name <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Building2 size={16} className="absolute left-3.5 text-slate-400" />
                      <input
                        required
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-3.5 bg-slate-50/50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      College Address <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <MapPin size={16} className="absolute left-3.5 text-slate-400" />
                      <input
                        required
                        type="text"
                        name="collegeAddress"
                        value={formData.collegeAddress}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-3.5 bg-slate-50/50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Representative Row: Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      Representative Name <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User size={16} className="absolute left-3.5 text-slate-400" />
                      <input
                        required
                        type="text"
                        name="repName"
                        value={formData.repName}
                        onChange={handleChange}
                        className="w-full h-11 pl-10 pr-3.5 bg-slate-50/50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="relative" ref={roleDropdownRef}>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      Designation / Role <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <BookOpen size={16} className="absolute left-3.5 text-slate-400 pointer-events-none z-10" />
                      <button
                        type="button"
                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                        className={`w-full h-11 pl-10 pr-10 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-left font-semibold cursor-pointer flex items-center justify-between transition-all ${errors.repRole
                            ? 'border-red-500 ring-1 ring-red-500/20'
                            : isRoleOpen
                              ? 'border-slate-800 ring-2 ring-slate-800/10 bg-white'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                      >
                        <span className={formData.repRole ? 'text-slate-900 font-semibold' : 'text-slate-500 font-normal'}>
                          {formData.repRole || 'Select Designation / Role'}
                        </span>
                        <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${isRoleOpen ? 'rotate-180 text-slate-800' : ''}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isRoleOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {ROLE_OPTIONS.map((role) => {
                            const isSelected = formData.repRole === role;
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, repRole: role }));
                                  if (errors.repRole) setErrors(prev => ({ ...prev, repRole: null }));
                                  setIsRoleOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-xs sm:text-sm text-left flex items-center justify-between transition-colors cursor-pointer ${isSelected
                                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                                    : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 font-medium'
                                  }`}
                              >
                                <span>{role}</span>
                                {isSelected && <Check size={16} className="text-emerald-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {errors.repRole && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">• {errors.repRole}</p>
                    )}
                  </div>
                </div>

                {/* Contact Row: Email, Contact Number & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      Official Email <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={16} className="absolute left-3.5 text-slate-400" />
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="name@college.edu"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full h-11 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none transition-all font-medium ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">• {errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      Contact Number <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone size={16} className="absolute left-3.5 text-slate-400" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        placeholder="10-digit number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full h-11 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none transition-all font-medium ${errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">• {errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* WhatsApp & Program Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      WhatsApp Number <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <MessageSquare size={16} className="absolute left-3.5 text-emerald-600" />
                      <input
                        required
                        type="tel"
                        name="whatsapp"
                        placeholder="10-digit WhatsApp number"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className={`w-full h-11 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none transition-all font-medium ${errors.whatsapp ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">• {errors.whatsapp}</p>
                    )}
                  </div>

                  <div className="relative" ref={programDropdownRef}>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                      Preferred Workshop Program <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Sparkles size={16} className="absolute left-3.5 text-slate-400 pointer-events-none z-10" />
                      <button
                        type="button"
                        onClick={() => setIsProgramOpen(!isProgramOpen)}
                        className={`w-full h-11 pl-10 pr-10 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-left font-semibold cursor-pointer flex items-center justify-between transition-all ${isProgramOpen
                            ? 'border-slate-800 ring-2 ring-slate-800/10 bg-white'
                            : 'border-slate-200 hover:border-slate-400'
                          }`}
                      >
                        <span className="text-slate-900 font-semibold truncate">
                          {PROGRAM_OPTIONS.find(p => p.value === formData.preferredProgram)?.label || formData.preferredProgram}
                        </span>
                        <ChevronDown size={16} className={`text-slate-500 shrink-0 transition-transform duration-200 ${isProgramOpen ? 'rotate-180 text-slate-800' : ''}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isProgramOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 sm:left-auto sm:right-0 bottom-full mb-2 w-full sm:w-[380px] bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] py-2 overflow-hidden max-h-72 overflow-y-auto"
                        >
                          {PROGRAM_OPTIONS.map((prog) => {
                            const isSelected = formData.preferredProgram === prog.value;
                            return (
                              <button
                                key={prog.value}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, preferredProgram: prog.value }));
                                  setIsProgramOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-xs sm:text-sm text-left flex items-start justify-between transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                                    : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 font-medium'
                                }`}
                              >
                                <span className="leading-snug pr-2">{prog.label}</span>
                                {isSelected && <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Submit Action CTA (Half Width & Pay Now Style) */}
                <div className="pt-3 flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-2/3 md:w-1/2 py-3 bg-white border-2 border-slate-700 text-slate-900 font-extrabold rounded-md hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40 transition-all duration-200 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-sm group"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Proposal</span>
                        <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

