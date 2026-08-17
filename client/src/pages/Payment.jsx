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
  AlertCircle,
  Droplet,
  MapPin,
  BookOpen
} from 'lucide-react';
import Container from '../components/ui/Container';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // If no state is found, redirect back to enroll
    if (!location.state || !location.state.formData) {
      navigate('/enroll');
    } else {
      setFormData(location.state.formData);
    }
  }, [location, navigate]);

  if (!formData) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate final application processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/pass', {
        state: {
          formData,
          paymentId: 'APP' + Math.floor(100000 + Math.random() * 900000)
        }
      });
    }, 1500);
  };

  const handleEdit = () => {
    navigate('/application', { state: { formData } });
  };

  const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`.trim();

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-12">
      <Container>
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <button
            onClick={handleEdit}
            title="Back to Application Form"
            aria-label="Back to Application Form"
            className="p-1 -ml-1 text-slate-600 hover:text-emerald-600 mb-4 transition-colors group cursor-pointer"
          >
            <ChevronLeft size={28} className="transform group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Panel: Application Details Verification Card */}
            <div className="lg:col-span-2">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>Edit Details</span>
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
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <User size={24} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-slate-800">{fullName}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs">
                          <p className="text-slate-500 flex items-center gap-1">
                            <Mail size={13} className="text-slate-400" />
                            {formData.email}
                          </p>
                          {formData.phone && (
                            <p className="text-slate-500 flex items-center gap-1">
                              <Phone size={13} className="text-slate-400" />
                              {formData.phone}
                            </p>
                          )}
                          {formData.dob && (
                            <p className="text-slate-500 flex items-center gap-1">
                              <Calendar size={13} className="text-slate-400" />
                              DOB: {formData.dob}
                            </p>
                          )}
                          {formData.bloodGroup && (
                            <p className="text-slate-500 flex items-center gap-1 font-semibold text-emerald-700">
                              <Droplet size={12} className="fill-emerald-500 text-emerald-600" />
                              Blood Group: {formData.bloodGroup}
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
                          <span className="text-xs text-slate-400 block font-medium">College Address</span>
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
            <div className="lg:col-span-1">
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
                    <span className="font-semibold text-slate-800 w-16 text-left">₹1,999</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-emerald-600 w-16 text-left">₹0</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Taxes</span>
                    <span className="font-semibold text-emerald-600 w-16 text-left">₹0</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Processing Fee</span>
                    <span className="font-semibold text-emerald-600 w-16 text-left">₹0</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">Subtotal</span>
                    <span className="text-sm font-bold text-slate-800 w-16 text-left">₹1,999</span>
                  </div>
                </div>

                {/* Total Payable */}
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-4 mb-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1">Total Amount</span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-white px-2.5 py-0.5 rounded border border-emerald-200 shadow-xs inline-block">
                      All Inclusive
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600 block">₹1,999</span>
                  </div>
                </div>

                {/* Non-Refundable Fee Notice */}
                <div className="mb-4 px-3.5 py-2.5 bg-amber-50/90 border border-amber-200/80 rounded-lg flex items-center gap-2 text-[11px] text-amber-800 font-medium">
                  <AlertCircle size={15} className="text-amber-600 shrink-0" />
                  <span><strong>Note:</strong> Registration fee is strictly non-refundable once paid.</span>
                </div>

                {/* Pay & Submit Button */}
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-transparent border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:border-[3px] hover:border-emerald-700 hover:text-emerald-700 transition-all duration-150 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mb-4"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay Now</span>
                      <ArrowRight size={18} />
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

