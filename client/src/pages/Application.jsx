import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, ChevronDown, ArrowRight, Camera, X, RefreshCw, User, Upload } from 'lucide-react';

const PROGRAM_OPTIONS = [
  { value: 'AI Summit', label: 'AI Summit' },
  { value: 'AI Summit 2026', label: 'AI Summit 2026' },
  { value: 'AI Research Lab', label: 'AI Research & Project Lab' },
  { value: 'College Campus Workshop', label: 'College Campus Partnership Program' },
  { value: 'Mentorship & Training', label: 'Expert Mentorship & Training' }
];

const getSemesterOptions = (degree) => {
  if (!degree) {
    return [
      '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
      '5th Semester', '6th Semester', '7th Semester', '8th Semester', 'Passout / Alumni'
    ];
  }
  const d = degree.toLowerCase();
  if (d.includes('mca') || d.includes('m.tech') || d.includes('m.sc')) {
    return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', 'Passout / Alumni'];
  }
  if (d.includes('bca') || d.includes('b.sc') || d.includes('diploma')) {
    return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', 'Passout / Alumni'];
  }
  if (d.includes('b.tech') || d.includes('b.e.')) {
    return [
      '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
      '5th Semester', '6th Semester', '7th Semester', '8th Semester', 'Passout / Alumni'
    ];
  }
  return [
    '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
    '5th Semester', '6th Semester', '7th Semester', '8th Semester', 'Passout / Alumni'
  ];
};

export const Application = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summitDetails = location.state?.summitDetails;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const existingData = location.state?.formData;
  const [formData, setFormData] = useState({
    firstName: existingData?.firstName || '',
    middleName: existingData?.middleName || '',
    lastName: existingData?.lastName || '',
    email: existingData?.email || '',
    dob: existingData?.dob || '',
    bloodGroup: existingData?.bloodGroup || '',
    phone: existingData?.phone || '',
    alternatePhone: existingData?.alternatePhone || '',
    tenthPercentage: existingData?.tenthPercentage || '',
    twelfthPercentage: existingData?.twelfthPercentage || '',
    diplomaPercentage: existingData?.diplomaPercentage || '',
    branch: existingData?.branch || '',
    year: existingData?.year || '',
    institution: existingData?.institution || summitDetails?.college || 'National Institute of Technology',
    collegeAddress: existingData?.collegeAddress || summitDetails?.location || 'Campus Main Road, NIT Campus',
    degree: existingData?.degree || '',
    semester: existingData?.semester || '',
    programInterest: existingData?.programInterest || location.state?.programInterest || 'AI Summit 2026',
    message: existingData?.message || '',
    selfie: existingData?.selfie || null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Camera State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setIsCameraOpen(true);
      setCameraError('');
      
      // Wait for React to render the video element before assigning the stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
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

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, selfie: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      stopCamera(); // Cleanup on unmount
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // Phone / Alternate Phone - allow digits only and max 10 characters
    if (name === 'phone' || name === 'alternatePhone') {
      val = value.replace(/\D/g, '').slice(0, 10);

      // Real-time validation for Phone
      if (name === 'phone') {
        if (val.length > 0 && val.length < 10) {
          setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }));
        } else {
          setErrors(prev => ({ ...prev, phone: null }));
        }
      }

      // Real-time validation for Alternate Phone
      if (name === 'alternatePhone') {
        if (val.length > 0 && val.length < 10) {
          setErrors(prev => ({ ...prev, alternatePhone: 'Alternate phone number must be 10 digits' }));
        } else {
          setErrors(prev => ({ ...prev, alternatePhone: null }));
        }
      }
    }

    setFormData(prev => ({ ...prev, [name]: val }));

    // Real-time validation for 10th and 12th percentage
    if (name === 'tenthPercentage' || name === 'twelfthPercentage') {
      const numVal = parseFloat(value);
      if (value !== '' && (isNaN(numVal) || numVal < 0 || numVal > 100)) {
        setErrors(prev => ({
          ...prev,
          [name]: 'Percentage must be between 0% and 100%'
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }

    // Real-time validation for Diploma percentage (allows N/A or numeric percentage)
    if (name === 'diplomaPercentage') {
      const trimmedUpper = value.trim().toUpperCase();
      if (value !== '' && trimmedUpper !== 'N/A' && trimmedUpper !== 'NA') {
        const numVal = parseFloat(value);
        if (isNaN(numVal) || numVal < 0 || numVal > 100) {
          setErrors(prev => ({
            ...prev,
            diplomaPercentage: 'Enter percentage (0-100) or N/A'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            diplomaPercentage: null
          }));
        }
      } else {
        setErrors(prev => ({
          ...prev,
          diplomaPercentage: null
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate Phone Number (10 digits)
    if (!formData.phone || formData.phone.trim().length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Validate Alternate Phone (if provided, must be 10 digits)
    if (formData.alternatePhone && formData.alternatePhone.trim().length > 0 && formData.alternatePhone.trim().length !== 10) {
      newErrors.alternatePhone = 'Alternate phone number must be 10 digits';
    }

    // Validate Blood Group
    if (!formData.bloodGroup || formData.bloodGroup.trim() === '') {
      newErrors.bloodGroup = 'Blood Group is required';
    }

    // Validate 10th Marks (%)
    const tenthNum = parseFloat(formData.tenthPercentage);
    if (!formData.tenthPercentage || formData.tenthPercentage.trim() === '') {
      newErrors.tenthPercentage = '10th Percentage is required';
    } else if (isNaN(tenthNum) || tenthNum < 0 || tenthNum > 100) {
      newErrors.tenthPercentage = 'Please enter a valid percentage between 0% and 100%';
    }

    // Validate 12th Marks (%)
    const twelfthNum = parseFloat(formData.twelfthPercentage);
    if (!formData.twelfthPercentage || formData.twelfthPercentage.trim() === '') {
      newErrors.twelfthPercentage = '12th / Diploma Percentage is required';
    } else if (isNaN(twelfthNum) || twelfthNum < 0 || twelfthNum > 100) {
      newErrors.twelfthPercentage = 'Please enter a valid percentage between 0% and 100%';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const updatedData = { ...formData, appliedDate: formData.appliedDate || new Date().toISOString() };
      navigate('/payment', { state: { formData: updatedData } });
    }, 1200);
  };

  const activeCollege = summitDetails?.college || formData.institution || 'National Institute of Technology';

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* 01 FULL WIDTH HERO SECTION */}
      <section className="relative bg-[#070B14] text-white pt-10 pb-20 overflow-hidden">
        {/* Background elements with reduced overlay for a clearer background image */}
        <div className="absolute inset-0 opacity-45 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/60 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            {summitDetails ? (
              <>
                <span className="text-white font-bold tracking-wider uppercase text-xs mb-2 block">
                  {summitDetails.title} &bull; {summitDetails.duration}
                </span>
                <h1
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
                  className="text-3xl md:text-4xl lg:text-4xl leading-tight mb-2 text-slate-200 tracking-wide"
                >
                  {activeCollege}
                </h1>
                <p
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
                  className="text-slate-400 text-lg mb-0 leading-relaxed tracking-wide"
                >
                  {summitDetails.subtitle}
                </p>
              </>
            ) : (
              <>
                <h1
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
                  className="text-3xl md:text-4xl lg:text-5xl leading-tight mb-2 text-slate-200 tracking-wide"
                >
                  {activeCollege}
                </h1>
                <p
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
                  className="text-slate-400 text-lg mb-0 leading-relaxed tracking-wide"
                >
                  Join the VMANOUS ecosystem and accelerate your career with our flagship programs, designed by industry experts.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 02 FORM SECTION */}
      <section className="pb-10 relative -mt-12 z-30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-md overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-white text-slate-800 p-5 md:px-8 md:pt-6 md:pb-3 border-b border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-1">
                  Application Form
                </h2>
                <p className="text-slate-500 flex items-center gap-2 flex-wrap text-xs md:text-sm">
                  Applying for:
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                    {formData.programInterest} &bull; {activeCollege} {summitDetails?.date ? ` • ${summitDetails.date}` : ''}
                  </span>
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-5 md:p-8">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-green-100 text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto mb-6 text-base leading-relaxed">
                    Thank you for applying to join the VMANOUS ecosystem. Our team will review your details and reach out shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ ...formData, message: '' });
                    }}
                    className="px-6 py-3 bg-[#2D73B4] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
                  >
                    Submit Another Response
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column (Name & Contact Details) */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* First Name & Middle Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            placeholder="Rahul"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                          />
                        </div>

                        {/* Middle Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            name="middleName"
                            placeholder="Kumar"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Last Name (Under First Name) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            placeholder="Sharma"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                          />
                        </div>
                        {/* Empty space next to Last Name */}
                        <div></div>
                      </div>

                      {/* Phone Number & Alternate Phone Number */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Phone Number */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            maxLength={10}
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.phone
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/15'
                              }`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                              <span>•</span> {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Alternate Phone Number */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alternate Phone Number
                          </label>
                          <input
                            type="tel"
                            name="alternatePhone"
                            maxLength={10}
                            placeholder="9876543210"
                            value={formData.alternatePhone}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border text-slate-800 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.alternatePhone
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/15'
                              }`}
                          />
                          {errors.alternatePhone && (
                            <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                              <span>•</span> {errors.alternatePhone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email Address & Date of Birth */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            placeholder="rahul@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all duration-200 placeholder:text-slate-400"
                          />
                        </div>

                        {/* Date of Birth & Blood Group */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Date of Birth */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              name="dob"
                              required
                              value={formData.dob}
                              onChange={handleChange}
                              className="w-full px-3 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all duration-200 placeholder:text-slate-400 cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                          </div>

                          {/* Blood Group */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Blood Group <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <select
                                name="bloodGroup"
                                required
                                value={formData.bloodGroup}
                                onChange={(e) => {
                                  handleChange(e);
                                  if (e.target.value) setErrors(prev => ({ ...prev, bloodGroup: null }));
                                }}
                                className={`w-full pl-3 pr-8 py-2.5 rounded-lg bg-[#F8FAFC] border text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.bloodGroup
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                                    : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/15'
                                  }`}
                              >
                                <option value="">Select</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                              </select>
                              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                            {errors.bloodGroup && (
                              <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                                <span>•</span> {errors.bloodGroup}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selfie Upload - Circular Design Without Square Background */}
                    <div className="lg:col-span-1 flex flex-col items-center justify-center">
                      <label className="block text-xs font-bold text-slate-700 mb-2 text-center w-full">
                        Selfie Photo <span className="text-red-500">*</span>
                      </label>
                      <div className="w-full flex-1 flex flex-col items-center justify-center py-2">
                        {formData.selfie ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="relative group">
                              <img src={formData.selfie} alt="Selfie preview" className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-emerald-500" />
                              <div className="absolute inset-0 rounded-full bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <button type="button" onClick={retakePhoto} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shadow-sm">
                              <RefreshCw size={13} /> Retake Photo
                            </button>
                          </div>
                        ) : isCameraOpen ? (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-40 h-40 rounded-full shadow-xl overflow-hidden relative bg-black border-4 border-emerald-500">
                              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-full scale-x-[-1]" />
                              <canvas ref={canvasRef} className="hidden" />
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={capturePhoto} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 py-2 text-xs font-bold shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5" aria-label="Take photo">
                                <Camera size={15} /> Capture
                              </button>
                              <button type="button" onClick={stopCamera} className="bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-full p-2 transition-colors cursor-pointer" aria-label="Cancel">
                                <X size={15} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div
                              onClick={startCamera}
                              className="w-36 h-36 rounded-full border-2 border-dashed border-emerald-400 p-1.5 flex items-center justify-center relative group cursor-pointer hover:border-emerald-600 transition-all duration-300 shadow-sm"
                            >
                              <div className="w-full h-full rounded-full bg-emerald-100/90 text-emerald-700 flex flex-col items-center justify-center group-hover:bg-emerald-200/80 transition-colors">
                                <User size={52} className="text-emerald-700 mb-0.5 group-hover:scale-105 transition-transform" />
                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Selfie</span>
                              </div>
                            </div>
                            {cameraError && <p className="text-[11px] text-red-500 font-medium text-center max-w-[180px]">{cameraError}</p>}
                            <div className="flex flex-wrap justify-center items-center gap-2">
                              <button type="button" onClick={startCamera} className="px-4 py-2 border-2 border-emerald-600 text-emerald-700 bg-white text-xs font-bold rounded-lg shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1.5">
                                <Camera size={14} /> Capture
                              </button>
                              <div className="relative overflow-hidden">
                                <button type="button" className="px-4 py-2 border-2 border-[#2D73B4] text-[#2D73B4] bg-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1.5">
                                  <Upload size={14} /> Upload
                                </button>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleImageUpload} 
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Academic Scores Section: 10th %, 12th %, and Diploma % */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 10th % */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        10th Grade Marks (%) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="tenthPercentage"
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="e.g. 88.5"
                          value={formData.tenthPercentage}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 pr-8 rounded-lg bg-[#F8FAFC] border text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.tenthPercentage
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                            : 'border-slate-200 focus:border-[#2D73B4] focus:ring-[#2D73B4]/15'
                            }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">%</span>
                      </div>
                      {errors.tenthPercentage && (
                        <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                          <span>•</span> {errors.tenthPercentage}
                        </p>
                      )}
                    </div>

                    {/* 12th % */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        12th Marks (%) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="twelfthPercentage"
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="e.g. 91.2"
                          value={formData.twelfthPercentage}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 pr-8 rounded-lg bg-[#F8FAFC] border text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.twelfthPercentage
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                            : 'border-slate-200 focus:border-[#2D73B4] focus:ring-[#2D73B4]/15'
                            }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">%</span>
                      </div>
                      {errors.twelfthPercentage && (
                        <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                          <span>•</span> {errors.twelfthPercentage}
                        </p>
                      )}
                    </div>

                    {/* Diploma % */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Diploma Marks (%)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="diplomaPercentage"
                          placeholder="e.g. 85.0 or N/A"
                          value={formData.diplomaPercentage}
                          onChange={handleChange}
                          className={`w-full px-4 py-2.5 ${formData.diplomaPercentage && formData.diplomaPercentage.toString().toUpperCase() !== 'N/A' ? 'pr-8' : 'pr-4'
                            } rounded-lg bg-[#F8FAFC] border text-slate-800 text-sm font-medium focus:bg-white focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.diplomaPercentage
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-200 focus:border-[#2D73B4] focus:ring-[#2D73B4]/15'
                            }`}
                        />
                        {formData.diplomaPercentage && formData.diplomaPercentage.toString().toUpperCase() !== 'N/A' && !isNaN(parseFloat(formData.diplomaPercentage)) && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 pointer-events-none">%</span>
                        )}
                      </div>
                      {errors.diplomaPercentage && (
                        <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                          <span>•</span> {errors.diplomaPercentage}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* College Name & College Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Institution / College Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        College Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="institution"
                        readOnly
                        value={formData.institution}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-semibold outline-none cursor-not-allowed select-none"
                      />
                    </div>

                    {/* College Address (Fixed Read-Only) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        College Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="collegeAddress"
                        readOnly
                        value={formData.collegeAddress}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-semibold outline-none cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Degree, Specialization & Semester (In Single 3-Column Row at Bottom) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Degree (IT Focused) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Degree
                      </label>
                      <div className="relative">
                        <select
                          name="degree"
                          value={formData.degree}
                          onChange={handleChange}
                          className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="">Select Degree</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="B.E.">B.E.</option>
                          <option value="BCA">BCA</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="MCA">MCA</option>
                          <option value="M.Sc">M.Sc</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Other IT Degree">Other IT Degree</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Specialization (IT Focused) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Specialization
                      </label>
                      <div className="relative">
                        <select
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="">Select Specialization</option>
                          <option value="Computer Science">Computer Science</option>
                          <option value="Information Technology (IT)">Information Technology (IT)</option>
                          <option value="Artificial Intelligence & Machine Learning (AI & ML)">Artificial Intelligence & Machine Learning (AI & ML)</option>
                          <option value="Data Science & Analytics">Data Science & Analytics</option>
                          <option value="Cyber Security & Digital Forensics">Cyber Security & Digital Forensics</option>
                          <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                          <option value="Full Stack Software Engineering">Full Stack Software Engineering</option>
                          <option value="Web & Mobile App Development">Web & Mobile App Development</option>
                          <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                          <option value="Other IT Specialization">Other IT Specialization</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Semester (Dynamic based on selected Degree) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Semester
                      </label>
                      <div className="relative">
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          className="w-full pl-3 pr-8 py-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs font-medium focus:bg-white focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="">Select Semester</option>
                          {getSemesterOptions(formData.degree).map((sem) => (
                            <option key={sem} value={sem}>
                              {sem}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>


                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-white border-2 border-slate-300 text-slate-900 font-bold rounded-lg hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-pulse">Processing...</span>
                      ) : (
                        <>
                          <span>Next</span>
                          <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
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
