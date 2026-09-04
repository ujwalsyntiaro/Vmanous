import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Calendar,
  User,
  Download,
  QrCode,
  Clock,
  Loader2,
  FileText,
  X,
  Receipt,
  Printer,
  ShieldCheck,
  Building2,
  IndianRupee,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import Container from '../components/ui/Container';
import { fetchApplicationsAsync, computeAppFinancialBreakdown } from '../services/applicationService';
import { fetchSummitsAsync, getSummits, isCollegeMatch } from '../services/summitService';

const PaymentSuccessfulSeal = ({ size = 95 }) => {
  return (
    <div className="transform -rotate-12 select-none pointer-events-none drop-shadow-xs flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring Border */}
        <circle cx="100" cy="100" r="92" stroke="#047857" strokeWidth="2.5" fill="none" opacity="0.9" />

        {/* Inner Concentric Ring Border */}
        <circle cx="100" cy="100" r="72" stroke="#047857" strokeWidth="1.8" fill="none" opacity="0.9" />

        {/* Outer Curved Ring Track Text */}
        <path id="cornerSealArc" d="M 24,100 A 76,76 0 1,1 176,100 A 76,76 0 1,1 24,100" fill="none" />
        <text fill="#047857" fontSize="10" fontWeight="800" letterSpacing="2.5" opacity="0.9">
          <textPath href="#cornerSealArc" startOffset="0%">
            • VMANOUS OFFICIAL PASS • 2026 •
          </textPath>
        </text>

        {/* Center Text: Payment Successful (2 Lines) */}
        <text
          x="100"
          y="88"
          fill="#047857"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          Payment
        </text>
        <text
          x="100"
          y="118"
          fill="#047857"
          fontSize="22"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          Successful
        </text>
      </svg>
    </div>
  );
};

export const Pass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const passCodeParam = searchParams.get('passCode') || searchParams.get('txnId');
  const initialReceiptState = searchParams.get('receipt') === 'true';

  const [formData, setFormData] = useState(location.state?.formData || null);
  const [paymentId, setPaymentId] = useState(location.state?.paymentId || null);
  const [matchedSummit, setMatchedSummit] = useState(location.state?.summitDetails || null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(initialReceiptState);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // 1. Fetch summits to accurately resolve workshop pricing & tax settings
    fetchSummitsAsync().then((summits) => {
      if (Array.isArray(summits) && summits.length > 0) {
        const prog = (formData?.programInterest || formData?.programTitle || '').trim().toLowerCase();
        const sumId = formData?.summitId;
        const col = formData?.institution || formData?.collegeName || '';
        const found = summits.find(s =>
          (sumId && (s.id === sumId || Number(s.id) === Number(sumId))) ||
          (s.title && prog && s.title.trim().toLowerCase() === prog && (!s.college || isCollegeMatch(col, s.college))) ||
          (prog && s.title && (s.title.trim().toLowerCase().includes(prog) || prog.includes(s.title.trim().toLowerCase())))
        );
        if (found) {
          setMatchedSummit(found);
        }
      }
    }).catch(e => console.warn('Could not fetch summits for pass:', e));

    if (!formData && passCodeParam) {
      fetchApplicationsAsync().then(({ applications }) => {
        const matched = (applications || []).find(
          (a) =>
            a.passCode === passCodeParam ||
            a.transactionId === passCodeParam ||
            String(a.id) === String(passCodeParam)
        );
        if (matched) {
          const nameParts = (matched.studentName || matched.name || "").trim().split(" ");
          setFormData({
            firstName: nameParts[0] || "Student",
            lastName: nameParts.slice(1).join(" ") || "",
            fullName: matched.studentName || matched.name,
            email: matched.email,
            phone: matched.phone || "N/A",
            bloodGroup: matched.bloodGroup || "O+",
            institution: matched.collegeName,
            collegeAddress: matched.venueLocation || "Main Campus Auditorium",
            programInterest: matched.programTitle || "AI Summit Workshop 2026",
            degree: matched.degree || "B.Tech",
            branch: matched.branch || "Computer Science",
            semester: matched.year || "3rd Year",
            selfie: matched.selfiePhotoUrl,
            selfiePhotoUrl: matched.selfiePhotoUrl,
            tenthPercentage: matched.marksTenth ? String(matched.marksTenth).replace("%", "") : "85",
            twelfthPercentage: matched.marksTwelfth ? String(matched.marksTwelfth).replace("%", "") : "83",
            appliedDate: matched.createdAt,
            paymentStatus: matched.paymentStatus || "Paid",
            amountPaid: (matched.amountPaid !== undefined && matched.amountPaid !== null) ? Number(matched.amountPaid) : 0,
            baseAmount: (matched.baseAmount !== undefined && matched.baseAmount !== null) ? Number(matched.baseAmount) : null,
            gstAmount: (matched.gstAmount !== undefined && matched.gstAmount !== null) ? Number(matched.gstAmount) : null,
            platformFee: (matched.platformFee !== undefined && matched.platformFee !== null) ? Number(matched.platformFee) : 0,
            summitId: matched.summitId || null,
            transactionId: matched.transactionId || matched.passCode,
            passCode: matched.passCode
          });
          setPaymentId(matched.passCode || matched.transactionId);
        }
      }).catch(err => console.warn('Could not fetch backend application:', err));
    } else if (!formData && !passCodeParam) {
      navigate('/enroll');
    }
  }, [formData, passCodeParam, navigate]);

  if (!formData) return null;

  const fullName = `${formData.firstName || ''} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName || ''}`.trim() || formData.fullName || 'Participant';

  const currentDate = formData.appliedDate
    ? new Date(formData.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const passId = paymentId || formData.passCode || formData.transactionId || ('APP' + Math.floor(100000 + Math.random() * 900000));
  const workshopTiming = formData.timing || '10:00 AM - 04:00 PM';

  // Dynamic financial breakdown calculation based on application and summit settings
  const financialData = computeAppFinancialBreakdown(formData || {}, matchedSummit ? [matchedSummit] : null);
  
  const baseFee = (formData?.baseAmount !== undefined && formData?.baseAmount !== null)
    ? Number(formData.baseAmount)
    : Number(financialData.base);

  const gstFee = (formData?.gstAmount !== undefined && formData?.gstAmount !== null)
    ? Number(formData.gstAmount)
    : Number(financialData.gst);

  const procFee = (formData?.platformFee !== undefined && formData?.platformFee !== null)
    ? Number(formData.platformFee)
    : Number(financialData.platformFee);

  const totalPaid = (formData?.amountPaid !== undefined && formData?.amountPaid !== null)
    ? Number(formData.amountPaid)
    : Number((baseFee + gstFee + procFee).toFixed(2));

  const taxRate = matchedSummit?.taxRate !== undefined
    ? Number(matchedSummit.taxRate)
    : (formData?.taxRate !== undefined ? Number(formData.taxRate) : (gstFee > 0 && baseFee > 0 ? Math.round((gstFee / baseFee) * 100) : 0));

  const taxMode = matchedSummit?.taxMode || formData?.taxMode || 'Exclusive';

  const gstLabel = (() => {
    if (taxRate === 0 || gstFee === 0) {
      return 'GST (0% Tax)';
    }
    if (taxMode === 'Inclusive') {
      return `GST (${taxRate}% Inclusive Tax)`;
    }
    return `GST (${taxRate}% Exclusive Tax)`;
  })();

  const paymentGatewayName = formData?.paymentMethod || (totalPaid === 0 ? 'Direct Free Registration' : 'Cashfree Payment Gateway (UPI/Cards/NetBanking)');

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('workshop-pass-card');
    if (!element) return;

    setIsDownloading(true);

    try {
      const rect = element.getBoundingClientRect();
      const widthInMm = rect.width * 0.264583;
      const heightInMm = rect.height * 0.264583;

      const opt = {
        margin: [0, 0, 0, 0],
        filename: `Vmanous_Workshop_Pass_${passId}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: {
          unit: 'mm',
          format: [widthInMm, heightInMm + 1.5],
          orientation: 'portrait'
        },
        pagebreak: { mode: [] }
      };

      await html2pdf()
        .from(element)
        .set(opt)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          while (pdf.internal.getNumberOfPages() > 1) {
            pdf.deletePage(pdf.internal.getNumberOfPages());
          }
        })
        .save();

      setIsDownloading(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-6 pb-10 flex items-center justify-center">
      <Container className="w-full">
        <div className="max-w-md mx-auto">

          {/* Header Success Message */}
          <div className="text-center mb-4 sm:mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="flex items-center justify-center mx-auto mb-1.5"
            >
              <CheckCircle2 size={28} className="text-emerald-600 stroke-[2.4]" />
            </motion.div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 mb-0.5">Registration Successful!</h1>
            <p className="text-slate-500 text-xs">Your digital workshop pass has been generated.</p>
          </div>

          <motion.div
            id="workshop-pass-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-transparent pt-7 px-1 pb-1 relative"
          >
            {/* Main Pass Card Box */}
            <div className="bg-white border border-black relative pt-0 pb-0 shadow-sm">
              {/* Close Icon (Top-Right Corner: No background, No border, Zoom In/Out on Hover) */}
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="absolute top-2.5 right-2.5 z-30 p-1 text-slate-400 hover:text-slate-800 bg-transparent border-0 cursor-pointer outline-none focus:outline-none transition-colors"
                title="Close"
                data-html2canvas-ignore="true"
              >
                <X size={22} strokeWidth={2.2} />
              </motion.button>

              {/* Green Checkmark Circle Symbol - Exactly Centered on the Top Horizontal Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 block overflow-visible">
                    {/* Mask only the 1px black horizontal line behind icon */}
                    <rect x="10" y="47" width="80" height="6" fill="#ffffff" stroke="none" />
                    {/* Clean Solid White Fill inside Circle Interior */}
                    <circle cx="50" cy="50" r="35" fill="#ffffff" stroke="none" />
                    {/* Open Green Circle Arc with Gap at Top Right (Extended further right to 84, 38) */}
                    <path d="M 61 17 A 36 36 0 1 0 84 38" fill="none" stroke="#5cb85c" strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Checkmark Extending Out of Circle in Top Right */}
                    <path d="M 30 52 L 44 66 L 76 20" fill="none" stroke="#5cb85c" strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Top Pass Header (Payment Successful! Heading + College / Institution) */}
              <div className="bg-white pt-9 sm:pt-10 pb-1 px-4 text-center relative flex flex-col items-center z-20">
                {/* Payment Successful! Heading (Sleek Semibold Font Weight) */}
                <h1 className="text-xl sm:text-2xl font-semibold text-[#5cb85c] tracking-tight mb-2">
                  Payment Successful!
                </h1>

                {/* College / Institution Name & Address Header */}
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase mb-0.5 break-words px-2 text-slate-800 leading-tight">
                  {formData.institution || 'NATIONAL INSTITUTE OF TECHNOLOGY'}
                </h2>
                {formData.collegeAddress && (
                  <p className="text-slate-500 text-xs font-semibold px-2 mb-0.5">
                    {formData.collegeAddress}
                  </p>
                )}
                <p className="text-slate-400 text-[11px] font-bold tracking-widest mt-0.5">{passId}</p>
              </div>

              {/* Participant Profile & Info Section (Side-by-Side: Info on Left, Avatar on Right) */}
              <div className="p-4 flex items-center justify-between gap-4 bg-white">
                {/* Left Side: Program Badge, Name & Contact Details */}
                <div className="flex-1 text-left space-y-1">
                  <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mb-0.5">
                    {formData.programInterest || 'AI Summit Workshop 2026'}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">{fullName}</h3>

                  {/* Mobile Number & Blood Group Info (Always Displayed) */}
                  <div className="flex items-center gap-4 pt-1.5 mt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Mobile Number</span>
                      <span className="text-[11px] font-semibold text-slate-700 block">{formData.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Blood Group</span>
                      <span className="text-[11px] font-extrabold text-slate-900 block">{formData.bloodGroup || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Selfie / Avatar Photo (Slightly larger circle) */}
                <div className="shrink-0 mr-1 sm:mr-2">
                  {formData.selfie || formData.selfiePhotoUrl ? (
                    <img
                      src={formData.selfie || formData.selfiePhotoUrl}
                      alt={fullName}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-slate-300 shadow-md bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                      <svg
                        width="100"
                        height="100"
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
                </div>
              </div>

              {/* Center Divider Line (Touches left & right borders edge-to-edge) */}
              <div className="w-full py-1 px-0 bg-white">
                <div className="w-full h-[1px] bg-slate-300" />
              </div>

              {/* Main Participant Academic Grid */}
              <div className="px-4 pt-1.5 pb-2.5 bg-white">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="px-2 py-2.5 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center min-h-[56px]">
                    <span className="text-[10px] text-slate-400 font-bold block leading-tight">Degree</span>
                    <span className="text-[11px] font-bold text-slate-800 block mt-1 leading-normal break-words max-w-full">
                      {formData.degree || 'N/A'}
                    </span>
                  </div>
                  <div className="px-2 py-2.5 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center min-h-[56px]">
                    <span className="text-[10px] text-slate-400 font-bold block leading-tight">Specialization</span>
                    <span className="text-[11px] font-bold text-slate-800 block mt-1 leading-normal break-words max-w-full">
                      {formData.branch || 'Computer Science'}
                    </span>
                  </div>
                  <div className="px-2 py-2.5 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center min-h-[56px]">
                    <span className="text-[10px] text-slate-400 font-bold block leading-tight">Semester</span>
                    <span className="text-[11px] font-bold text-slate-800 block mt-1 leading-normal break-words max-w-full">
                      {formData.semester || formData.year || formData.yearOfStudy || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Cutout Line (Sleek Triangular Wedge Cuts < and >) */}
              <div className="relative flex items-center bg-white py-1 overflow-visible z-10">
                {/* Left Side Wedge Cutout (<) */}
                <div className="relative -ml-[1px] shrink-0 z-20">
                  <svg viewBox="0 0 16 24" className="w-2.5 h-4.5 sm:w-3 sm:h-5.5 block overflow-visible">
                    {/* Mask out straight vertical card border line behind wedge */}
                    <rect x="-2" y="0" width="20" height="24" fill="#ffffff" stroke="none" />
                    {/* Background Mask Fill for Notch Area */}
                    <path d="M 0,0 L 12,12 L 0,24 Z" fill="#f8fafc" stroke="none" />
                    {/* Triangular Wedge Stroke (< shape) */}
                    <path d="M 0,0 L 12,12 L 0,24" fill="none" stroke="#000000" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>

                {/* Center Darkened Dashed Tear Line (Touches notch tips directly) */}
                <div className="flex-1 border-b-2 border-dashed border-black/80 mx-0" />

                {/* Right Side Wedge Cutout (>) */}
                <div className="relative -mr-[1px] shrink-0 z-20">
                  <svg viewBox="0 0 16 24" className="w-2.5 h-4.5 sm:w-3 sm:h-5.5 block overflow-visible">
                    {/* Mask out straight vertical card border line behind wedge */}
                    <rect x="-2" y="0" width="20" height="24" fill="#ffffff" stroke="none" />
                    {/* Background Mask Fill for Notch Area */}
                    <path d="M 16,0 L 4,12 L 16,24 Z" fill="#f8fafc" stroke="none" />
                    {/* Triangular Wedge Stroke (> shape) */}
                    <path d="M 16,0 L 4,12 L 16,24" fill="none" stroke="#000000" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </div>

              {/* Premium QR & Event Details Section (Compact Vertical Padding) */}
              <div className="py-4 px-4 sm:px-5 bg-white flex items-start justify-between gap-4">
                {/* Left Side: Date, Time & Official Status */}
                <div className="space-y-2.5 flex-1 relative">

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      <Calendar size={13} className="text-emerald-600 shrink-0" /> Event Date
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{currentDate}</p>
                  </div>

                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      <Clock size={13} className="text-emerald-600 shrink-0" /> Workshop Time
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900">{workshopTiming}</p>
                  </div>

                  <div className="pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200/80 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Official Pass
                    </span>
                  </div>
                </div>

                {/* Right Side: Clean Transparent QR Code with Thin Black Corner Brackets */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative p-1.5 bg-transparent flex items-center justify-center">
                    {/* Top-Left Corner Bracket (┌) */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-black rounded-tl-xs" />

                    {/* Top-Right Corner Bracket (┐) */}
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-black rounded-tr-xs" />

                    {/* Bottom-Left Corner Bracket (└) */}
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-black rounded-bl-xs" />

                    {/* Bottom-Right Corner Bracket (┘) */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-black rounded-br-xs" />

                    <QRCodeSVG
                      value={qrDataText}
                      size={132}
                      bgColor="transparent"
                      fgColor="#0F172A"
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-4">
            <button
              type="button"
              onClick={() => setIsReceiptOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
            >
              <Receipt size={16} />
              <span>View Payment Receipt</span>
            </button>
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
          </div>

        </div>
      </Container>

      {/* 🧾 PAYMENT RECEIPT POPUP MODAL */}
      <AnimatePresence>
        {isReceiptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header (Clean Light Emerald Theme - No Black Background) */}
              <div className="bg-emerald-50/90 border-b border-emerald-100 p-3.5 sm:p-4 flex items-center justify-between relative">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">Official Payment Receipt</h3>
                    <p className="text-[11px] text-emerald-700 font-medium">VMANOUS Academic & Workshop Invoice</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReceiptOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-emerald-100/60 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content / Invoice Receipt View (Compact & No Extra Space) */}
              <div id="receipt-modal-content" className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
                {/* Header Status & Seal */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Receipt No / Pass ID</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 tracking-wider">{passId}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <ShieldCheck size={13} />
                    VERIFIED & PAID
                  </span>
                </div>

                {/* Participant & Workshop Details */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Student Name</span>
                    <span className="font-extrabold text-slate-800">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Email Address</span>
                    <span className="font-semibold text-slate-700 truncate block">{formData.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">College Institution</span>
                    <span className="font-bold text-slate-800 truncate block">{formData.institution || 'Partner College'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Program / Workshop</span>
                    <span className="font-bold text-emerald-700 truncate block">{formData.programInterest || 'AI Summit Workshop'}</span>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Payment Breakdown</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    <div className="flex justify-between p-2 bg-slate-50 font-bold text-slate-500 text-[10px]">
                      <span>Description</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between p-2 text-slate-700">
                      <span>Base Workshop Registration Fee</span>
                      <span className="font-bold">₹{baseFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between p-2 text-slate-700">
                      <span>{gstLabel}</span>
                      <span className="font-bold">₹{gstFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between p-2 text-slate-700">
                      <span>Platform Processing Fee</span>
                      <span className="font-bold">₹{procFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-emerald-50 text-emerald-900 font-black text-xs sm:text-sm">
                      <span>Total Paid Amount</span>
                      <span className="text-emerald-700">₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Reference & Gateway Info */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-800">{formData.transactionId || paymentId || passId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Payment Gateway:</span>
                    <span className="font-semibold text-slate-700">{paymentGatewayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-400">Date & Time:</span>
                    <span className="font-semibold text-slate-700">{currentDate}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls (No Black Button) */}
              <div className="p-3 sm:p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 sm:py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsReceiptOpen(false)}
                  className="px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Close Receipt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pass;
