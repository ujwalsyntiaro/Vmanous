import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCheck,
  CheckCircle2,
  ChevronLeft,
  Edit3,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building2,
  Award,
  ArrowRight,
  Droplet,
  MapPin,
  BookOpen
} from 'lucide-react';
import Container from '../components/ui/Container';
import { initiatePhonePePayment } from '../services/paymentService';
import { addApplication } from '../services/applicationService';
import { addStudent } from '../services/studentService';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const summitDetails = location.state?.summitDetails;
  const basePrice = summitDetails?.price !== undefined ? Number(summitDetails.price) : 1999;
  const originalPrice = summitDetails?.originalPrice ? Number(summitDetails.originalPrice) : 4999;
  const taxRate = summitDetails?.taxRate !== undefined ? Number(summitDetails.taxRate) : 18;
  const taxMode = summitDetails?.taxMode || 'Exclusive';
  const rawProcessingFee = summitDetails?.processingFee !== undefined ? Number(summitDetails.processingFee) : 0;
  const processingFeeType = summitDetails?.processingFeeType || 'Fixed';
  const processingFee = processingFeeType === 'Percentage'
    ? Math.round((basePrice * rawProcessingFee) / 100)
    : rawProcessingFee;

  const isFree = basePrice === 0 || taxMode === 'Free';
  const taxAmount = isFree || taxMode === 'Inclusive' ? 0 : Math.round((basePrice * taxRate) / 100);
  const totalAmount = isFree ? 0 : (basePrice + taxAmount + processingFee);

  useEffect(() => {
    // If no state is found, redirect back to enroll
    if (!location.state || !location.state.formData) {
      navigate('/enroll');
    } else {
      setFormData(location.state.formData);
    }
  }, [location, navigate]);

  if (!formData) return null;

  const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim();

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await initiatePhonePePayment({
        ...formData,
        programInterest: summitDetails?.title || formData.programInterest || '',
        institution: summitDetails?.college || formData.institution || '',
        collegeAddress: summitDetails?.address || formData.collegeAddress || '',
        totalAmount: totalAmount
      });

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        alert(result.error || 'Could not initiate PhonePe Payment. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('PhonePe initiation error:', err);
      alert('Network error connecting to PhonePe server.');
      setIsProcessing(false);
    }
  };

  const handleSimulateFailure = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const paymentId = 'TXN_FAIL_' + Math.floor(10000000 + Math.random() * 90000000);
    const studentPhone = formData.phone || formData.mobileNumber || '';
    const tenthMarks = formData.tenthPercentage ? (formData.tenthPercentage.includes('%') ? formData.tenthPercentage : `${formData.tenthPercentage}%`) : (formData.tenthPercent ? `${formData.tenthPercent}%` : '85%');
    const twelfthMarks = formData.twelfthPercentage ? (formData.twelfthPercentage.includes('%') ? formData.twelfthPercentage : `${formData.twelfthPercentage}%`) : (formData.twelfthPercent ? `${formData.twelfthPercent}%` : '82%');

    const failedRecord = {
      studentName: fullName,
      email: formData.email,
      phone: studentPhone,
      programTitle: summitDetails?.title || formData.programInterest || '',
      collegeName: summitDetails?.college || formData.institution || '',
      venueLocation: summitDetails?.address || formData.collegeAddress || '',
      branch: formData.specialization || 'Computer Science & Engineering',
      year: formData.yearOfStudy || '3rd Year',
      degree: formData.qualification || 'B.Tech',
      marksTenth: tenthMarks,
      marksTwelfth: twelfthMarks,
      selfiePhotoUrl: formData.photoPreview || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
      paymentStatus: 'Failed',
      paymentFailureReason: 'Bank Server Timeout / Transaction Cancelled by User',
      verificationStatus: 'Pending Audit',
      transactionId: paymentId,
      amountPaid: 0,
      passCode: null
    };

    addApplication(failedRecord);

    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment Attempt Failed! The failed transaction history lead has been saved to MySQL Database.");
      navigate('/admin/applications');
    }, 1000);
  };


  const handleEdit = () => {
    navigate('/application', { state: { formData } });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <Container>
        <div className="max-w-6xl mx-auto">

          {/* Back Button */}
          <button
            onClick={handleEdit}
            title="Back to Application Form"
            aria-label="Back to Application Form"
            className="p-1 -ml-1 text-slate-600 hover:text-emerald-600 mb-4 transition-colors group cursor-pointer"
          >
            <ChevronLeft size={28} className="transform group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Panel: Application Details Verification Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-md border border-gray-200 p-5 md:p-6 shadow-sm">

                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <FileCheck className="text-emerald-600" size={24} />
                      Application Details Verification
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Please review all your details carefully before final confirmation.
                    </p>
                  </div>

                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-900 hover:text-emerald-600 text-xs font-bold transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-transparent"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                </div>

                {/* Verification Content Grid */}
                <div className="space-y-4">

                  {/* Top Row: Applicant Profile Summary & Selfie */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {formData.selfie ? (
                        <img
                          src={formData.selfie}
                          alt="Applicant Selfie"
                          className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 shadow-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-50 border-2 border-slate-700 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full"
                          >
                            <circle cx="50" cy="50" r="50" fill="#F8FAFC" />
                            <circle cx="50" cy="38" r="17" fill="#94A3B8" />
                            <path d="M 16 92 A 36 36 0 0 1 84 92 Z" fill="#94A3B8" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-slate-800">{fullName}</h3>
                        <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 gap-y-1 mt-0.5 text-[11px] sm:text-xs">
                          <p className="text-slate-500 flex items-center gap-1 shrink-0">
                            <Mail size={12} className="text-slate-400 shrink-0" />
                            <span>{formData.email}</span>
                          </p>
                          {formData.phone && (
                            <p className="text-slate-500 flex items-center gap-1 shrink-0">
                              <Phone size={12} className="text-slate-400 shrink-0" />
                              <span>{formData.phone}</span>
                            </p>
                          )}
                          {formData.dob && (
                            <p className="text-slate-500 flex items-center gap-1 shrink-0">
                              <Calendar size={12} className="text-slate-400 shrink-0" />
                              <span>DOB: {formData.dob}</span>
                            </p>
                          )}
                          {formData.bloodGroup && (
                            <p className="text-emerald-700 flex items-center gap-1 font-semibold shrink-0">
                              <Droplet size={11} className="fill-emerald-500 text-emerald-600 shrink-0" />
                              <span>Blood: {formData.bloodGroup}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Contact Information */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                      <Phone size={14} /> Contact Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                        <span className="text-xs text-slate-400 block font-medium">Primary Phone Number</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{formData.phone}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                        <span className="text-xs text-slate-400 block font-medium">Alternate Phone Number</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                          {formData.alternatePhone || 'Not Provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Academic Performance */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                      <Award size={14} /> Academic Performance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                        <span className="text-xs text-slate-400 block font-medium">10th Grade Marks (%)</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                          {formData.tenthPercentage ? `${formData.tenthPercentage}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                        <span className="text-xs text-slate-400 block font-medium">12th Marks (%)</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                          {formData.twelfthPercentage ? `${formData.twelfthPercentage}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                        <span className="text-xs text-slate-400 block font-medium">Diploma Marks (%)</span>
                        <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                          {formData.diplomaPercentage
                            ? (formData.diplomaPercentage.toString().toUpperCase() === 'N/A' ? 'N/A' : `${formData.diplomaPercentage}%`)
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: College & Program Details */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                      <GraduationCap size={14} /> College & Academic Info
                    </h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                          <span className="text-xs text-slate-400 block font-medium">College Name</span>
                          <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{formData.institution}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                          <span className="text-xs text-slate-400 block font-medium">Venue Location</span>
                          <span className="text-sm font-semibold text-slate-800 mt-0.5 block">{formData.collegeAddress || 'NIT Campus'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                          <span className="text-xs text-slate-400 block font-medium">Degree</span>
                          <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                            {formData.degree || 'Not Specified'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                          <span className="text-xs text-slate-400 block font-medium">Specialization</span>
                          <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                            {formData.branch || 'Not Specified'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-100">
                          <span className="text-xs text-slate-400 block font-medium">Semester</span>
                          <span className="text-sm font-semibold text-slate-800 mt-0.5 block">
                            {formData.semester || formData.year || 'Not Specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Right Panel: Payment & Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100">
                  Payment & Fee Details
                </h3>

                {/* Selected Program Track */}
                <div className="mb-5 pb-4 border-b border-gray-100">
                  <span className="text-xs text-slate-400 font-medium block mb-1">Selected Program Track</span>
                  <p className="text-sm font-bold text-slate-800">{formData.programInterest}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formData.institution}</p>
                </div>

                {/* Itemized Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Workshop Registration Fee</span>
                    <span className="font-bold text-slate-800 text-left min-w-[70px] inline-block">
                      {isFree ? 'FREE' : `₹${basePrice.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Taxes {taxMode === 'Inclusive' ? '(Included)' : taxRate ? `(${taxRate}% GST)` : ''}</span>
                    <span className="font-bold text-slate-800 text-left min-w-[70px] inline-block">
                      {taxMode === 'Inclusive' ? 'Included' : `₹${taxAmount.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  {processingFee > 0 && (
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span>Platform Fee {processingFeeType === 'Percentage' ? `(${rawProcessingFee}%)` : ''}</span>
                      <span className="font-bold text-slate-800 text-left min-w-[70px] inline-block">
                        ₹{processingFee.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">Subtotal</span>
                    <span className="text-base font-extrabold text-slate-900 text-left min-w-[70px] inline-block">
                      {isFree ? 'FREE' : `₹${totalAmount.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>

                {/* Total Payable */}
                <div className="bg-[#F8FAFC] rounded-lg p-4 mb-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">Total Amount</span>
                    <span className="text-[11px] font-medium text-slate-600 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-xs inline-block">
                      {isFree ? '100% Free' : taxMode === 'Inclusive' ? 'GST Included' : `Inc. ${taxRate}% GST`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 block">
                      {isFree ? 'FREE' : `₹${totalAmount.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>

                {/* Non-Refundable Fee Notice */}
                <div className="mb-4 text-[11px] font-normal text-slate-600 px-1">
                  <span>Note: The registration fee is non-refundable after payment.</span>
                </div>

                {/* Pay & Submit Button */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="w-full py-3 bg-white border-2 border-slate-700 text-slate-900 font-extrabold rounded-lg hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50/40 transition-all duration-200 flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mb-4 shadow-sm group"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-700/30 border-t-slate-900 rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Now</span>
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-slate-400 font-medium">
                  Payments are 100% encrypted and safe
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};

export default Payment;

