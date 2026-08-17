import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, ChevronDown, ArrowRight, Camera, X, RefreshCw } from 'lucide-react';

const PROGRAM_OPTIONS = [
  { value: 'AI Summit', label: 'AI Summit' },
  { value: 'AI Summit 2026', label: 'AI Summit 2026' },
  { value: 'AI Research Lab', label: 'AI Research & Project Lab' },
  { value: 'College Campus Workshop', label: 'College Campus Partnership Program' },
  { value: 'Mentorship & Training', label: 'Expert Mentorship & Training' }
];

export const Application = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summitDetails = location.state?.summitDetails;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    branch: '',
    year: '',
    institution: summitDetails?.college || '',
    programInterest: location.state?.programInterest || 'AI Summit 2026',
    message: '',
    selfie: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Camera State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
      setCameraError('');
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
      setFormData({ ...formData, selfie: imageUrl });
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setFormData({ ...formData, selfie: null });
    startCamera();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
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
      
      {/* 01 FULL WIDTH HERO SECTION */}
      <section className="relative bg-[#070B14] text-white pt-16 pb-28 overflow-hidden">
        {/* Background elements to mimic the dark data science image */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/90 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            {summitDetails ? (
              <>
                <span className="text-white font-bold tracking-wider uppercase text-sm mb-4 block">
                  {summitDetails.title} &bull; {summitDetails.duration}
                </span>
                <h1 
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
                  className="text-4xl md:text-5xl lg:text-5xl leading-tight mb-3 text-slate-200 tracking-wide"
                >
                  {summitDetails.college || "Start Your Journey"}
                </h1>
                <p 
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
                  className="text-slate-400 text-xl mb-0 leading-relaxed tracking-wide"
                >
                  {summitDetails.subtitle}
                </p>
              </>
            ) : (
              <>
                <h1 
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
                  className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-3 text-slate-200 tracking-wide"
                >
                  College Name
                </h1>
                <p 
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
                  className="text-slate-400 text-xl mb-0 leading-relaxed tracking-wide"
                >
                  Join the VMANOUS ecosystem and accelerate your career with our flagship programs, designed by industry experts.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 02 FORM SECTION */}
      <section className="pb-20 relative -mt-16 z-30">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-xl overflow-hidden"
          >
          {/* Form Header */}
          <div className="bg-white text-slate-800 p-8 md:px-10 md:pt-10 md:pb-4 border-b border-gray-100 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-normal tracking-tight mb-3">
                Application Form
              </h2>
              <p className="text-slate-500 flex items-center gap-3 flex-wrap text-sm md:text-base">
                Applying for:
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2D73B4] font-bold uppercase tracking-wider">
                  {formData.programInterest} {summitDetails?.date ? ` • ${summitDetails.date}` : ''}
                </span>
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-8 md:p-10">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold text-[#0F172A] mb-4">
                  Application Submitted!
                </h3>
                <p className="text-slate-600 max-w-md mx-auto mb-8 text-lg leading-relaxed">
                  Thank you for applying to join the VMANOUS ecosystem. Our team will review your details and reach out shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ ...formData, message: '' });
                  }}
                  className="px-8 py-4 bg-[#2D73B4] text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
                >
                  Submit Another Response
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Rahul"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      placeholder="Kumar"
                      value={formData.middleName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Sharma"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column (Email, Phone) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                        />
                      </div>

                      {/* Alternate Phone */}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Alternate Phone Number
                        </label>
                        <input
                          type="tel"
                          name="alternatePhone"
                          placeholder="+91 98765 43210"
                          value={formData.alternatePhone}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selfie Upload */}
                  <div className="lg:col-span-1 h-full">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Selfie Photo <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full rounded-xl bg-[#F8FAFC] border border-slate-200 p-4 relative overflow-hidden h-[calc(100%-28px)] min-h-[160px] flex items-center justify-center">
                      {formData.selfie ? (
                        <div className="flex flex-col items-center gap-3">
                          <img src={formData.selfie} alt="Selfie preview" className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-md" />
                          <button type="button" onClick={retakePhoto} className="flex items-center gap-2 text-sm font-bold text-[#2D73B4] hover:text-blue-700 transition-colors">
                            <RefreshCw size={14} /> Retake Photo
                          </button>
                        </div>
                      ) : isCameraOpen ? (
                        <div className="flex flex-col items-center justify-center w-full h-full relative">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-lg bg-black" />
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3">
                            <button type="button" onClick={capturePhoto} className="bg-white text-[#2D73B4] rounded-full p-2.5 shadow-lg hover:scale-105 transition-transform" aria-label="Take photo">
                              <Camera size={20} />
                            </button>
                            <button type="button" onClick={stopCamera} className="bg-red-500 text-white rounded-full p-2.5 shadow-lg hover:scale-105 transition-transform" aria-label="Cancel">
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2D73B4]">
                            <Camera size={24} />
                          </div>
                          {cameraError && <p className="text-xs text-red-500 font-medium text-center">{cameraError}</p>}
                          <button type="button" onClick={startCamera} className="px-5 py-2 bg-white border border-slate-200 text-[#2D73B4] text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                            Open Camera
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Institution / College */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      College Name & Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      required
                      placeholder="National Institute of Technology"
                      value={formData.institution}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Specialization
                    </label>
                    <div className="relative">
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Specialization</option>
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
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Year of Study */}
                  {formData.branch && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Year of Study
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none"
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
                  <div className={`relative ${!formData.branch ? 'md:col-span-2' : ''}`}>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Program / Track Interest
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-5 py-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-4 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 cursor-pointer flex items-center justify-between"
                    >
                      <span className={formData.programInterest ? 'text-[#2D73B4] font-medium' : 'text-slate-800'}>
                        {PROGRAM_OPTIONS.find(o => o.value === formData.programInterest)?.label || formData.programInterest}
                      </span>
                      <ChevronDown size={18} className={`text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#2D73B4]' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden py-2 z-30">
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
                              className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isSelected
                                ? 'bg-blue-50/80 text-[#2D73B4] font-bold'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#2D73B4]'
                                }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <CheckCircle2 size={16} className="text-[#2D73B4]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>


                {/* Submit Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-[#2D73B4] hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg group cursor-pointer shadow-lg shadow-blue-500/30"
                  >
                    {isSubmitting ? (
                      <span className="inline-block animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <span>Next</span>
                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      </section>
    </div>
  );
};

export default Application;
