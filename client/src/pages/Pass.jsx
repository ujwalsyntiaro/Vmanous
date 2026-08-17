import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  User,
  Download,
  Home,
  QrCode,
  ShieldCheck,
  Building2,
  Clock,
  Loader2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import Container from '../components/ui/Container';

export const Pass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const paymentId = location.state?.paymentId;
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!formData) {
      navigate('/enroll');
    }
  }, [formData, navigate]);

  if (!formData) return null;

  const fullName = `${formData.firstName || ''} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName || ''}`.trim() || formData.fullName || 'Participant';

  const currentDate = formData.appliedDate
    ? new Date(formData.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const passId = paymentId || 'APP' + Math.floor(100000 + Math.random() * 900000);
  const workshopTiming = formData.timing || '10:00 AM - 04:00 PM';

  const qrDataText = `=== VMANOUS WORKSHOP PASS ===
Pass ID: ${passId}
Participant: ${fullName}
Email: ${formData.email || 'N/A'}
Mobile: ${formData.phone || 'N/A'}
Blood Group: ${formData.bloodGroup || 'N/A'}
College: ${formData.institution || 'N/A'}
Address: ${formData.collegeAddress || 'N/A'}
Degree: ${formData.degree || 'N/A'}
Specialization: ${formData.branch || 'N/A'}
Semester: ${formData.semester || formData.year || 'N/A'}
Program: ${formData.programInterest || 'AI Summit Workshop 2026'}
Timing: ${workshopTiming}
10th Marks: ${formData.tenthPercentage ? formData.tenthPercentage + '%' : 'N/A'}
12th Marks: ${formData.twelfthPercentage ? formData.twelfthPercentage + '%' : 'N/A'}
Diploma Marks: ${formData.diplomaPercentage || 'N/A'}
Status: VERIFIED & PAID
Issued On: ${currentDate}
=============================`;

  const handleDownloadPDF = () => {
    const element = document.getElementById('workshop-pass-card');
    if (!element) return;

    setIsDownloading(true);

    const opt = {
      margin: [8, 8, 8, 8],
      filename: `Vmanous_Workshop_Pass_${passId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsDownloading(false);
      })
      .catch((err) => {
        console.error("PDF generation failed:", err);
        window.print();
        setIsDownloading(false);
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-16 flex items-center justify-center">
      <Container className="w-full">
        <div className="max-w-md mx-auto">

          {/* Header Success Message */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-14 h-14 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs"
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">Registration Successful!</h1>
            <p className="text-slate-500 text-xs">Your digital workshop pass has been generated.</p>
          </div>

          {/* Vertical Ticket / Pass Badge UI */}
          <motion.div
            id="workshop-pass-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Top Pass Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 pt-6 pb-12 px-6 text-white text-center relative">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-100 mb-2">
                <span>Vmanous Tech</span>
                <span className="flex items-center gap-1 bg-emerald-800/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck size={12} className="text-emerald-300" /> Verified Pass
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black tracking-wider uppercase mb-1 line-clamp-2 px-2">
                {formData.institution || 'NATIONAL INSTITUTE OF TECHNOLOGY'}
              </h2>
              <p className="text-emerald-100 text-xs font-semibold tracking-widest">{passId}</p>
            </div>

            {/* Selfie / Avatar Section (Overlapping Top Banner) */}
            <div className="relative flex flex-col items-center -mt-10 px-6">
              {formData.selfie ? (
                <img
                  src={formData.selfie}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 border-4 border-white shadow-xl flex items-center justify-center">
                  <User size={44} />
                </div>
              )}

              <h3 className="text-lg font-bold text-slate-800 mt-3 text-center">{fullName}</h3>
              <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mt-1 text-center">
                {formData.programInterest || 'AI Summit Workshop 2026'}
              </p>
            </div>

            {/* Main Participant Details Grid */}
            <div className="p-6 space-y-4">

              {/* Personal Info Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-around text-center">
                {formData.phone && (
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Mobile Number</span>
                    <span className="text-xs font-semibold text-slate-700 block">{formData.phone}</span>
                  </div>
                )}
                {formData.bloodGroup && (
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Blood Group</span>
                    <span className="text-xs font-extrabold text-emerald-700 block">{formData.bloodGroup}</span>
                  </div>
                )}
              </div>

              {/* College & Academic Info */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-100">
                  <Building2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">College & Location</span>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">{formData.institution}</p>
                    {formData.collegeAddress && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{formData.collegeAddress}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Degree</span>
                    <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                      {formData.degree || 'N/A'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Specialization</span>
                    <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                      {formData.branch || 'Computer Science'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Semester</span>
                    <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                      {formData.semester || formData.year || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Ticket Cutout Line */}
            <div className="relative flex items-center my-1">
              <div className="w-5 h-5 bg-gray-50 rounded-full border border-slate-200 -ml-2.5" />
              <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-1" />
              <div className="w-5 h-5 bg-gray-50 rounded-full border border-slate-200 -mr-2.5" />
            </div>

            {/* QR Code Entry Section */}
            <div className="p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <div className="w-36 h-36 bg-white p-3 rounded-2xl border border-slate-200 shadow-md mb-2 flex items-center justify-center">
                <QRCodeSVG
                  value={qrDataText}
                  size={124}
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-3">Scan at venue entry</p>

              <div className="w-full space-y-2 pt-3 border-t border-slate-200/80 px-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    <Calendar size={13} className="text-emerald-600" /> Date
                  </span>
                  <span className="text-slate-800 font-bold">{currentDate}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1 font-medium text-slate-500">
                    <Clock size={13} className="text-emerald-600" /> Workshop Time
                  </span>
                  <span className="text-slate-800 font-bold">{workshopTiming}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-xs shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-emerald-600" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download PDF Pass</span>
                </>
              )}
            </button>
            <Link to="/" className="px-5 py-2.5 bg-white border-2 border-emerald-600 text-emerald-600 font-bold rounded-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer">
              <Home size={16} />
              Return to Homepage
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default Pass;
