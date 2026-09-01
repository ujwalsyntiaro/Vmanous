import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, User, Mail, Phone, Clock, Users, BookOpen, CheckCircle2, Check, BadgeCheck, ShieldCheck, Send, Shield, Sparkles, Briefcase, GraduationCap, ChevronDown, MessageSquare, FileText } from 'lucide-react';
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

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // College Name & Representative Name - Characters only (no numbers allowed)
    if (name === 'collegeName' || name === 'repName') {
      val = value.replace(/[0-9]/g, '');
      const fieldLabel = name === 'collegeName' ? 'College Name' : 'Representative Name';

      if (value !== val) {
        setErrors(prev => ({
          ...prev,
          [name]: `${fieldLabel} can only contain letters, numbers are not allowed`
        }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }

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

    // Official Email Validation - strictly lowercase only
    if (name === 'email') {
      const hasUppercase = /[A-Z]/.test(value);
      val = value.toLowerCase();

      if (hasUppercase) {
        setErrors(prev => ({ ...prev, email: 'Capital letters are not allowed. Email must be in lowercase.' }));
      } else if (val.trim().length > 0 && !emailRegex.test(val.trim())) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid lowercase email address (e.g. name@college.edu)' }));
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

    // Validate College Name
    if (!formData.collegeName || formData.collegeName.trim() === '') {
      newErrors.collegeName = 'Please enter College Name';
    } else if (/[0-9]/.test(formData.collegeName)) {
      newErrors.collegeName = 'College Name can only contain letters, numbers are not allowed';
    }

    // Validate Representative Name
    if (!formData.repName || formData.repName.trim() === '') {
      newErrors.repName = 'Please enter Representative Name';
    } else if (/[0-9]/.test(formData.repName)) {
      newErrors.repName = 'Representative Name can only contain letters, numbers are not allowed';
    }

    // Validate Designation / Role
    if (!formData.repRole || formData.repRole.trim() === '') {
      newErrors.repRole = 'Please select your Designation / Role';
    }

    // Validate Official Email (must be lowercase)
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Please enter your official email address';
    } else if (/[A-Z]/.test(formData.email)) {
      newErrors.email = 'Capital letters are not allowed in email address';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid lowercase official email address (e.g. name@college.edu)';
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
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-medium text-slate-900 leading-[1.15] tracking-tight">
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
            className="lg:col-span-7 bg-white rounded-2xl pt-4 px-4 pb-2.5 sm:pt-5 sm:px-5 sm:pb-3 md:pt-5 md:px-6 md:pb-3 border border-slate-200 shadow-xl shadow-slate-200/50"
          >
            {/* Form Header */}
            <div className="border-b border-slate-100 pb-2.5 mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-medium text-slate-900 tracking-tight">
                  Approach for AI Summit Proposal
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Fill in your college details to receive an official proposal & date confirmation.
                </p>
              </div>
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
                <h4 className="text-2xl font-medium text-slate-900">Request Submitted</h4>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">

                {/* Institution Row: College Name & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
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
                        className={`w-full h-9 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all font-normal ${errors.collegeName ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.collegeName && (
                      <p className="text-[11px] text-red-500 mt-1 font-normal">• {errors.collegeName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
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
                        className="w-full h-9 pl-10 pr-3.5 bg-slate-50/50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 transition-all font-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* Representative Row: Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
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
                        className={`w-full h-9 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all font-normal ${errors.repName ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.repName && (
                      <p className="text-[11px] text-red-500 mt-1 font-normal">• {errors.repName}</p>
                    )}
                  </div>

                  <div className="relative" ref={roleDropdownRef}>
                    <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
                      Designation / Role <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <BookOpen size={16} className="absolute left-3.5 text-slate-400 pointer-events-none z-10" />
                      <button
                        type="button"
                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                        className={`w-full h-9 pl-10 pr-8 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-left cursor-pointer flex items-center transition-all font-normal ${errors.repRole
                          ? 'border-red-500 ring-1 ring-red-500/20'
                          : isRoleOpen
                            ? 'border-slate-800 ring-2 ring-slate-800/10 bg-white'
                            : 'border-slate-200 hover:border-slate-400'
                          }`}
                      >
                        <span className={`truncate ${formData.repRole ? 'text-slate-900 font-normal' : 'text-slate-400 font-normal'}`}>
                          {formData.repRole || 'Select Designation / Role'}
                        </span>
                      </button>
                      <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 transition-transform duration-200 ${isRoleOpen ? 'rotate-180 text-slate-800' : ''}`} />
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
                                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                                  : 'text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 font-normal'
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
                      <p className="text-[11px] text-red-500 mt-1 font-normal">• {errors.repRole}</p>
                    )}
                  </div>
                </div>

                {/* Contact Row: Email, Contact Number & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
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
                        className={`w-full h-9 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all font-normal ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1 font-normal">• {errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
                      Contact Number <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone size={16} className="absolute left-3.5 text-slate-400" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        placeholder="Contact Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full h-9 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all font-normal ${errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-red-500 mt-1 font-normal">• {errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
                      WhatsApp Number <span className="text-emerald-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <MessageSquare size={16} className="absolute left-3.5 text-emerald-600" />
                      <input
                        required
                        type="tel"
                        name="whatsapp"
                        placeholder="WhatsApp Number"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className={`w-full h-9 pl-10 pr-3.5 bg-slate-50/50 border rounded-md text-xs sm:text-sm text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all font-normal ${errors.whatsapp ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10'}`}
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="text-[11px] text-red-500 mt-1 font-normal">• {errors.whatsapp}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs sm:text-sm font-normal text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    placeholder="Expected dates, student count, notes..."
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full max-w-full min-w-[160px] p-3 border border-slate-200 rounded-md bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10 text-xs sm:text-sm text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition-colors resize shadow-2xs box-border"
                  />
                </div>

                {/* Submit Action CTA */}
                <div className="border-t border-slate-100 mt-2.5 pt-2.5 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-1.5 bg-white border border-slate-700 text-slate-900 font-medium rounded-md hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40 transition-all duration-200 flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-xs group shrink-0"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Submit Proposal</span>
                        <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform duration-200" />
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

