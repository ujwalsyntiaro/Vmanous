import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, ChevronDown, ArrowRight, Camera, X, RefreshCw, User, Upload, Calendar, Clock } from 'lucide-react';

const PROGRAM_OPTIONS = [
  { value: 'AI Summit', label: 'AI Summit' },
  { value: 'AI Summit 2026', label: 'AI Summit 2026' },
  { value: 'AI Research Lab', label: 'AI Research & Project Lab' },
  { value: 'College Campus Workshop', label: 'College Campus Partnership Program' },
  { value: 'Mentorship & Training', label: 'Expert Mentorship & Training' }
];

const SPECIALIZATION_OPTIONS = [
  'Computer Science',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AI & ML)',
  'Data Science & Analytics',
  'Cyber Security & Digital Forensics',
  'Cloud Computing & DevOps',
  'Full Stack Software Engineering',
  'Web & Mobile App Development',
  'IoT & Embedded Systems'
];

const DEGREE_OPTIONS = [
  'B.Tech',
  'B.E.',
  'BCA',
  'B.Sc',
  'M.Tech',
  'MCA',
  'M.Sc',
  'Diploma'
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
  const initialBranch = existingData?.branch || '';

  // Extract custom branch string if formatted as "Other (xyz)" or standalone custom
  let extractedCustom = '';
  let isCustomInitial = false;
  if (initialBranch) {
    if (!SPECIALIZATION_OPTIONS.includes(initialBranch)) {
      isCustomInitial = true;
      if (initialBranch.startsWith('Other (') && initialBranch.endsWith(')')) {
        extractedCustom = initialBranch.slice(7, -1);
      } else if (initialBranch !== 'Other' && initialBranch !== 'Other IT Specialization') {
        extractedCustom = initialBranch;
      }
    }
  }

  const [selectedBranch, setSelectedBranch] = useState(
    isCustomInitial ? 'Other' : (initialBranch === 'Other IT Specialization' ? 'Other' : initialBranch)
  );
  const [customBranch, setCustomBranch] = useState(extractedCustom);
  const [isCustomBranchOpen, setIsCustomBranchOpen] = useState(isCustomInitial && !extractedCustom);

  // Extract custom degree string if formatted as "Other (xyz)" or standalone custom
  const initialDegree = existingData?.degree || '';
  let extractedDegreeCustom = '';
  let isCustomDegreeInitial = false;
  if (initialDegree) {
    if (!DEGREE_OPTIONS.includes(initialDegree)) {
      isCustomDegreeInitial = true;
      if (initialDegree.startsWith('Other (') && initialDegree.endsWith(')')) {
        extractedDegreeCustom = initialDegree.slice(7, -1);
      } else if (initialDegree !== 'Other' && initialDegree !== 'Other IT Degree') {
        extractedDegreeCustom = initialDegree;
      }
    }
  }

  const [selectedDegree, setSelectedDegree] = useState(
    isCustomDegreeInitial ? 'Other' : (initialDegree === 'Other IT Degree' ? 'Other' : initialDegree)
  );
  const [customDegree, setCustomDegree] = useState(extractedDegreeCustom);
  const [isCustomDegreeOpen, setIsCustomDegreeOpen] = useState(isCustomDegreeInitial && !extractedDegreeCustom);
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
    institution: existingData?.institution || summitDetails?.college || '',
    collegeAddress: existingData?.collegeAddress || summitDetails?.address || summitDetails?.location || '',
    degree: existingData?.degree || '',
    semester: existingData?.semester || '',
    programInterest: existingData?.programInterest || location.state?.programInterest || (summitDetails?.title || ''),
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
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');

  // Sync state if navigation state changes dynamically
  useEffect(() => {
    if (location.state?.programInterest) {
      setFormData(prev => ({
        ...prev,
        programInterest: location.state.programInterest,
        institution: summitDetails?.college || prev.institution,
        collegeAddress: summitDetails?.address || summitDetails?.location || prev.collegeAddress
      }));
    }
  }, [location.state, summitDetails]);

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
      if (errors.selfie) setErrors(prev => ({ ...prev, selfie: null }));
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
        if (errors.selfie) setErrors(prev => ({ ...prev, selfie: null }));
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

  const handleBranchSelect = (e) => {
    const val = e.target.value;
    setSelectedBranch(val);
    if (errors.branch) setErrors(prev => ({ ...prev, branch: null }));
    if (val !== 'Other') {
      setCustomBranch('');
      setIsCustomBranchOpen(false);
      setFormData((prev) => ({ ...prev, branch: val }));
    } else {
      setIsCustomBranchOpen(true);
      const branchVal = customBranch.trim() ? `Other (${customBranch.trim()})` : 'Other';
      setFormData((prev) => ({ ...prev, branch: branchVal }));
    }
  };

  const handleCustomBranchChange = (e) => {
    const val = e.target.value;
    setCustomBranch(val);
    const branchVal = val.trim() ? `Other (${val.trim()})` : 'Other';
    setFormData((prev) => ({ ...prev, branch: branchVal }));
    if (errors.branch) setErrors(prev => ({ ...prev, branch: null }));
  };

  const handleCustomBranchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (customBranch.trim()) {
        setIsCustomBranchOpen(false);
      }
    }
  };

  const handleCustomBranchBlur = () => {
    if (customBranch.trim()) {
      setIsCustomBranchOpen(false);
    }
  };

  const handleDegreeSelect = (e) => {
    const val = e.target.value;
    setSelectedDegree(val);
    if (errors.degree) setErrors(prev => ({ ...prev, degree: null }));
    if (val !== 'Other') {
      setCustomDegree('');
      setIsCustomDegreeOpen(false);
      setFormData((prev) => ({ ...prev, degree: val }));
    } else {
      setIsCustomDegreeOpen(true);
      const degreeVal = customDegree.trim() ? `Other (${customDegree.trim()})` : 'Other';
      setFormData((prev) => ({ ...prev, degree: degreeVal }));
    }
  };

  const handleCustomDegreeChange = (e) => {
    const val = e.target.value;
    setCustomDegree(val);
    const degreeVal = val.trim() ? `Other (${val.trim()})` : 'Other';
    setFormData((prev) => ({ ...prev, degree: degreeVal }));
  };

  const handleCustomDegreeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (customDegree.trim()) {
        setIsCustomDegreeOpen(false);
      }
    }
  };

  const handleCustomDegreeBlur = () => {
    if (customDegree.trim()) {
      setIsCustomDegreeOpen(false);
    }
  };

  const handleDobChange = (e) => {
    let input = e.target.value.replace(/\D/g, '');
    if (input.length > 8) input = input.substring(0, 8);

    let formatted = input;
    if (input.length > 4) {
      formatted = `${input.substring(0, 2)}/${input.substring(2, 4)}/${input.substring(4, 8)}`;
    } else if (input.length > 2) {
      formatted = `${input.substring(0, 2)}/${input.substring(2)}`;
    }

    setFormData(prev => ({ ...prev, dob: formatted }));
    if (errors.dob) setErrors(prev => ({ ...prev, dob: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // First Name, Middle Name, Last Name - allow characters and spaces only, strip numbers
    if (name === 'firstName' || name === 'middleName' || name === 'lastName') {
      if (/[0-9]/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Only characters allowed, numbers not permitted' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
      val = value.replace(/[0-9]/g, '');
    }

    // Email Address - strict lowercase validation, no capital letters
    if (name === 'email') {
      if (/[A-Z]/.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Capital letters are not allowed in email' }));
      } else {
        setErrors(prev => ({ ...prev, email: null }));
      }
      val = value.toLowerCase();
    }

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
          setErrors(prev => ({ ...prev, alternatePhone: 'Alternate number must be 10 digits' }));
        } else {
          setErrors(prev => ({ ...prev, alternatePhone: null }));
        }
      }
    }

    // Real-time validation for 10th and 12th percentage (cap max 100)
    if (name === 'tenthPercentage' || name === 'twelfthPercentage') {
      const numVal = parseFloat(value);
      if (value !== '' && !isNaN(numVal) && numVal > 100) {
        val = '100';
        setErrors(prev => ({ ...prev, [name]: 'Percentage cannot exceed 100%' }));
      } else if (value !== '' && (isNaN(numVal) || numVal < 0)) {
        setErrors(prev => ({ ...prev, [name]: 'Percentage must be between 0% and 100%' }));
      } else {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }

    // Real-time validation for Diploma percentage (allows N/A or numeric percentage, cap max 100)
    if (name === 'diplomaPercentage') {
      const trimmedUpper = value.trim().toUpperCase();
      if (value !== '' && trimmedUpper !== 'N/A' && trimmedUpper !== 'NA') {
        const numVal = parseFloat(value);
        if (!isNaN(numVal) && numVal > 100) {
          val = '100';
          setErrors(prev => ({ ...prev, diplomaPercentage: 'Percentage cannot exceed 100%' }));
        } else if (isNaN(numVal) || numVal < 0) {
          setErrors(prev => ({ ...prev, diplomaPercentage: 'Enter percentage (0-100) or N/A' }));
        } else {
          setErrors(prev => ({ ...prev, diplomaPercentage: null }));
        }
      } else {
        setErrors(prev => ({ ...prev, diplomaPercentage: null }));
      }
    }

    setFormData(prev => ({ ...prev, [name]: val }));

    if (name === 'semester') {
      if (errors.semester) setErrors(prev => ({ ...prev, semester: null }));
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

    // Validate First Name (No numbers)
    if (/[0-9]/.test(formData.firstName)) {
      newErrors.firstName = 'Only characters allowed in First Name';
    }

    // Validate Middle Name (No numbers)
    if (/[0-9]/.test(formData.middleName)) {
      newErrors.middleName = 'Only characters allowed in Middle Name';
    }

    // Validate Last Name (No numbers)
    if (/[0-9]/.test(formData.lastName)) {
      newErrors.lastName = 'Only characters allowed in Last Name';
    }

    // Validate Email Address (No capital letters)
    if (/[A-Z]/.test(formData.email)) {
      newErrors.email = 'Capital letters are not allowed in email';
    }

    // Validate Phone Number (10 digits)
    if (!formData.phone || formData.phone.trim().length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Validate Alternate Phone (if provided, must be 10 digits)
    if (formData.alternatePhone && formData.alternatePhone.trim().length > 0 && formData.alternatePhone.trim().length !== 10) {
      newErrors.alternatePhone = 'Alternate number must be 10 digits';
    }

    // Validate Blood Group
    if (!formData.bloodGroup || formData.bloodGroup.trim() === '') {
      newErrors.bloodGroup = 'Blood Group is required';
    }

    // Validate Selfie Photo (Mandatory)
    if (!formData.selfie || (typeof formData.selfie === 'string' && formData.selfie.trim() === '')) {
      newErrors.selfie = 'Selfie photo is required';
    }

    // Validate DOB (DD/MM/YYYY)
    if (!formData.dob || formData.dob.trim().length !== 10) {
      newErrors.dob = 'Please enter Date of Birth (DD/MM/YYYY)';
    }

    // Validate Degree (Mandatory)
    if (!formData.degree || formData.degree.trim() === '' || formData.degree === 'Other') {
      if (formData.degree === 'Other' && customDegree.trim() !== '') {
        // Valid custom degree entered
      } else {
        newErrors.degree = 'Degree is required';
      }
    }

    // Validate Specialization / Branch (Mandatory)
    if (!formData.branch || formData.branch.trim() === '' || formData.branch === 'Other') {
      if (formData.branch === 'Other' && customBranch.trim() !== '') {
        // Valid custom branch entered
      } else {
        newErrors.branch = 'Specialization is required';
      }
    }

    // Validate Semester (Mandatory)
    if (!formData.semester || formData.semester.trim() === '') {
      newErrors.semester = 'Semester is required';
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
      navigate('/payment', { state: { formData: updatedData, summitDetails: summitDetails } });
    }, 1200);
  };

  const activeCollege = summitDetails?.college || formData.institution || 'National Institute of Technology';

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* 01 FULL WIDTH HERO SECTION */}
      <section className="relative bg-[#070B14] text-white pt-6 pb-12 overflow-hidden">
        {/* Background elements with reduced overlay for a clearer background image */}
        <div className="absolute inset-0 opacity-45 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/60 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            {summitDetails ? (
              <>
                <h1
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
                  className="text-3xl md:text-4xl lg:text-4xl leading-tight mb-1 text-slate-200 tracking-wide"
                >
                  {activeCollege}
                </h1>
                <p
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
                  className="text-slate-400 text-base md:text-lg mb-1 leading-relaxed tracking-wide"
                >
                  {summitDetails.subtitle}
                </p>

                {(summitDetails.date || summitDetails.time) && (
                  <div
                    style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300 }}
                    className="flex flex-col gap-0.5 text-slate-400 text-base md:text-lg tracking-wide mt-1"
                  >
                    {summitDetails.date && (
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-slate-400 shrink-0" />
                        <span>Date: {summitDetails.date}</span>
                      </div>
                    )}
                    {summitDetails.time && (
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-slate-400 shrink-0" />
                        <span>Time: {summitDetails.time}</span>
                      </div>
                    )}
                  </div>
                )}
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
      <section className="pb-10 relative -mt-6 z-30">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-xl rounded-md overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-white text-slate-800 p-4 md:px-8 md:pt-4 md:pb-2.5 border-b border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-1">
                  Application Form
                </h2>
                <p className="text-slate-500 flex items-center gap-2 flex-wrap text-xs md:text-sm">
                  Applying for:
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs tracking-wide">
                    {String(formData.programInterest || '').toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()).replace(/\bAi\b/g, 'AI')} &bull; {String(activeCollege || '').toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()).replace(/\b(Iit|Nit|Dtu|Vmv|Vnr|Vjiet)\b/g, m => m.toUpperCase()).replace(/&technology/gi, '& Technology')} {summitDetails?.date ? ` • ${summitDetails.date}` : ''}
                  </span>
                </p>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-4 sm:p-5 md:pt-4 md:px-8 md:pb-3.5">
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
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full px-4 py-1.5 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.firstName
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
                              }`}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                              <span>•</span> {errors.firstName}
                            </p>
                          )}
                        </div>

                        {/* Middle Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            name="middleName"
                            placeholder="Middle name"
                            value={formData.middleName}
                            onChange={handleChange}
                            className={`w-full px-4 py-1.5 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.middleName
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
                              }`}
                          />
                          {errors.middleName && (
                            <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                              <span>•</span> {errors.middleName}
                            </p>
                          )}
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
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full px-4 py-1.5 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.lastName
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
                              }`}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                              <span>•</span> {errors.lastName}
                            </p>
                          )}
                        </div>
                        {/* Empty space next to Last Name */}
                        <div></div>
                      </div>

                      {/* Phone Number & Alternate Number */}
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
                            placeholder="10-digit phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-1.5 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.phone
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
                              }`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                              <span>•</span> {errors.phone}
                            </p>
                          )}
                        </div>

                        {/* Alternate Number */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alternate Number
                          </label>
                          <input
                            type="tel"
                            name="alternatePhone"
                            maxLength={10}
                            placeholder="Alternate number"
                            value={formData.alternatePhone}
                            onChange={handleChange}
                            className={`w-full px-4 py-1.5 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.alternatePhone
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
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
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-1.5 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.email
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
                              }`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                              <span>•</span> {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Date of Birth & Blood Group */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Date of Birth */}
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="dob"
                              required
                              placeholder="DD/MM/YYYY"
                              maxLength={10}
                              value={formData.dob}
                              onChange={handleDobChange}
                              className={`w-full px-3 py-1.5 rounded-lg bg-white border text-slate-800 text-xs font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.dob
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                                  : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
                                }`}
                            />
                            {errors.dob && (
                              <p className="mt-1 text-[11px] text-red-500 font-semibold flex items-center gap-1">
                                <span>•</span> {errors.dob}
                              </p>
                            )}
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
                                className={`w-full pl-3 pr-8 py-1.5 rounded-lg bg-white border text-slate-800 text-xs font-medium focus:ring-2 outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.bloodGroup
                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                                  : 'border-slate-400 focus:border-emerald-600 focus:ring-emerald-600/15'
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
                              <img src={formData.selfie} alt="Selfie preview" className="w-40 h-40 object-cover rounded-full shadow-lg border-2 border-slate-700" />
                              <div className="absolute inset-0 rounded-full bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <button type="button" onClick={retakePhoto} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer shadow-sm">
                              <RefreshCw size={13} /> Retake Photo
                            </button>
                          </div>
                        ) : isCameraOpen ? (
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-40 h-40 rounded-full shadow-xl overflow-hidden relative bg-black border-2 border-slate-700">
                              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-full scale-x-[-1]" />
                              <canvas ref={canvasRef} className="hidden" />
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={capturePhoto} className="bg-slate-800 hover:bg-slate-900 text-white rounded-full px-4 py-2 text-xs font-bold shadow-md hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5" aria-label="Take photo">
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
                              className="w-36 h-36 rounded-full bg-slate-200 border border-slate-700 shadow-md flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer hover:shadow-lg transition-all duration-300"
                            >
                              <svg
                                width="144"
                                height="144"
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full group-hover:scale-105 transition-transform"
                              >
                                <circle cx="50" cy="50" r="50" fill="#F8FAFC" />
                                <circle cx="50" cy="38" r="17" fill="#94A3B8" />
                                <path d="M 16 92 A 36 36 0 0 1 84 92 Z" fill="#94A3B8" />
                              </svg>
                            </div>
                            {cameraError && <p className="text-[11px] text-red-500 font-medium text-center max-w-[180px]">{cameraError}</p>}
                            <div className="inline-flex items-stretch bg-white border border-slate-700 rounded-md overflow-hidden shadow-xs mt-3">
                              <button
                                type="button"
                                onClick={startCamera}
                                title="Capture Photo"
                                aria-label="Capture Photo"
                                className="px-3 py-1 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                              >
                                <Camera size={16} className="text-slate-800" />
                              </button>
                              <div className="w-[1px] bg-slate-700 shrink-0" />
                              <div className="relative overflow-hidden flex items-center justify-center">
                                <button
                                  type="button"
                                  title="Upload Photo"
                                  aria-label="Upload Photo"
                                  className="px-3 py-1 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                                >
                                  <Upload size={16} className="text-slate-800" />
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
                        {errors.selfie && (
                          <p className="text-[11px] text-red-500 font-semibold text-center mt-2">• {errors.selfie}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Academic Scores Section: 10th %, 12th %, and Diploma % */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 10th % */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        10th Marks (%) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="tenthPercentage"
                          required
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="10th percentage"
                          value={formData.tenthPercentage}
                          onChange={handleChange}
                          className={`w-full px-4 py-1.5 pr-8 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.tenthPercentage
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                            : 'border-slate-400 focus:border-[#2D73B4] focus:ring-[#2D73B4]/15'
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
                          placeholder="12th percentage"
                          value={formData.twelfthPercentage}
                          onChange={handleChange}
                          className={`w-full px-4 py-1.5 pr-8 rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.twelfthPercentage
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                            : 'border-slate-400 focus:border-[#2D73B4] focus:ring-[#2D73B4]/15'
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
                          placeholder="Diploma percentage or N/A"
                          value={formData.diplomaPercentage}
                          onChange={handleChange}
                          className={`w-full px-4 py-1.5 ${formData.diplomaPercentage && formData.diplomaPercentage.toString().toUpperCase() !== 'N/A' ? 'pr-8' : 'pr-4'
                            } rounded-lg bg-white border text-slate-800 text-sm font-medium focus:ring-2 outline-none transition-all duration-200 placeholder:text-slate-400 ${errors.diplomaPercentage
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
                              : 'border-slate-400 focus:border-[#2D73B4] focus:ring-[#2D73B4]/15'
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
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-100 border border-slate-400 text-slate-700 text-xs font-semibold outline-none cursor-not-allowed select-none"
                      />
                    </div>

                    {/* Venue Location (Fixed Read-Only) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Venue Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="collegeAddress"
                        readOnly
                        value={formData.collegeAddress}
                        className="w-full px-3 py-2.5 rounded-lg bg-slate-100 border border-slate-400 text-slate-700 text-xs font-semibold outline-none cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Degree, Specialization & Semester (In Single 3-Column Row at Bottom) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Degree (IT Focused) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Degree <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="degreeSelect"
                          value={selectedDegree}
                          onChange={handleDegreeSelect}
                          onClick={() => {
                            if (selectedDegree === 'Other' && !isCustomDegreeOpen) {
                              setIsCustomDegreeOpen(true);
                            }
                          }}
                          className={`w-full pl-3 pr-8 py-2.5 rounded-lg bg-white border text-slate-800 text-xs font-medium focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.degree ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-400'}`}
                        >
                          <option value="">Select Degree</option>
                          {DEGREE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                          <option value="Other">
                            {customDegree.trim() ? `Other (${customDegree.trim()})` : 'Other'}
                          </option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                      {errors.degree && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">• {errors.degree}</p>
                      )}

                      {/* Custom Degree Input when "Other" is chosen & input is open */}
                      {selectedDegree === 'Other' && isCustomDegreeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="mt-2 relative flex items-center gap-1.5"
                        >
                          <input
                            type="text"
                            placeholder="Type & press Enter"
                            value={customDegree}
                            onChange={handleCustomDegreeChange}
                            onKeyDown={handleCustomDegreeKeyDown}
                            onBlur={handleCustomDegreeBlur}
                            className="w-full pl-3 pr-3 py-2 rounded-lg bg-white border border-slate-400 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-slate-700/20 outline-none transition-all placeholder:text-slate-400"
                            autoFocus
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              if (customDegree.trim()) {
                                setIsCustomDegreeOpen(false);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-transparent border border-slate-700 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-[11px] font-semibold rounded-md transition-colors shrink-0 cursor-pointer"
                          >
                            Done
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Specialization (IT Focused) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Specialization <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="branchSelect"
                          value={selectedBranch}
                          onChange={handleBranchSelect}
                          onClick={() => {
                            if (selectedBranch === 'Other' && !isCustomBranchOpen) {
                              setIsCustomBranchOpen(true);
                            }
                          }}
                          className={`w-full pl-3 pr-8 py-2.5 rounded-lg bg-white border text-slate-800 text-xs font-medium focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.branch ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-400'}`}
                        >
                          <option value="">Select Specialization</option>
                          {SPECIALIZATION_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                          <option value="Other">
                            {customBranch.trim() ? `Other (${customBranch.trim()})` : 'Other'}
                          </option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                      {errors.branch && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">• {errors.branch}</p>
                      )}

                      {/* Custom Specialization Input when "Other" is chosen & input is open */}
                      {selectedBranch === 'Other' && isCustomBranchOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="mt-2 relative flex items-center gap-1.5"
                        >
                          <input
                            type="text"
                            placeholder="Type & press Enter"
                            value={customBranch}
                            onChange={handleCustomBranchChange}
                            onKeyDown={handleCustomBranchKeyDown}
                            onBlur={handleCustomBranchBlur}
                            className="w-full pl-3 pr-3 py-2 rounded-lg bg-white border border-slate-400 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-slate-700/20 outline-none transition-all placeholder:text-slate-400"
                            autoFocus
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              if (customBranch.trim()) {
                                setIsCustomBranchOpen(false);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-transparent border border-slate-700 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-[11px] font-semibold rounded-md transition-colors shrink-0 cursor-pointer"
                          >
                            Done
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Semester (Dynamic based on selected Degree) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Semester <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          className={`w-full pl-3 pr-8 py-2.5 rounded-lg bg-white border text-slate-800 text-xs font-medium focus:border-[#2D73B4] focus:ring-2 focus:ring-[#2D73B4]/15 outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.semester ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-400'}`}
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
                      {errors.semester && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">• {errors.semester}</p>
                      )}
                    </div>
                  </div>


                  {/* Submit Button */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-1.5 bg-white border border-slate-700 text-slate-900 font-semibold rounded-md hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all duration-200 flex items-center justify-center gap-1.5 text-xs sm:text-sm group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-xs"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-pulse">Processing...</span>
                      ) : (
                        <>
                          <span>Next</span>
                          <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform duration-300" />
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
