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
  Clock,
  Loader2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import Container from '../components/ui/Container';

const PaidStampSeal = ({ size = 88 }) => {
  // 32-point rosette starburst points
  const points = [];
  const cx = 100, cy = 100, rOuter = 96, rInner = 87, total = 32 * 2;
  for (let i = 0; i < total; i++) {
    const angle = (i * Math.PI) / (total / 2);
    const r = i % 2 === 0 ? rOuter : rInner;
    const x = cx + r * Math.sin(angle);
    const y = cy - r * Math.cos(angle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const pointsStr = points.join(' ');

  return (
    <div className="transform -rotate-12 select-none pointer-events-none drop-shadow-sm flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rosette Serrated Edge Outer Badge */}
        <polygon points={pointsStr} fill="#DC2626" />

        {/* Outer White Ring Separator */}
        <circle cx="100" cy="100" r="83" fill="#DC2626" />
        <circle cx="100" cy="100" r="78" fill="#FFFFFF" />

        {/* Concentric Double Red Circles */}
        <circle cx="100" cy="100" r="74" stroke="#DC2626" strokeWidth="3" fill="none" />
        <circle cx="100" cy="100" r="67" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />

        {/* Top Curved Text "THANK YOU" */}
        <path id="paidSealTopArc" d="M 36,100 A 64,64 0 0,1 164,100" fill="none" />
        <text fill="#DC2626" fontSize="11" fontWeight="900" letterSpacing="2">
          <textPath href="#paidSealTopArc" startOffset="50%" textAnchor="middle">
            • THANK YOU •
          </textPath>
        </text>

        {/* Bottom Curved Text "THANK YOU" */}
        <path id="paidSealBottomArc" d="M 164,100 A 64,64 0 0,1 36,100" fill="none" />
        <text fill="#DC2626" fontSize="11" fontWeight="900" letterSpacing="2">
          <textPath href="#paidSealBottomArc" startOffset="50%" textAnchor="middle">
            • THANK YOU •
          </textPath>
        </text>

        {/* Center Parallel Accent Lines */}
        <line x1="36" y1="74" x2="164" y2="74" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="126" x2="164" y2="126" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />

        {/* Main Bold Angled PAID Text */}
        <text
          x="100"
          y="112"
          fill="#DC2626"
          fontSize="40"
          fontWeight="950"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          letterSpacing="3"
        >
          PAID
        </text>
      </svg>
    </div>
  );
};

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

    const rect = element.getBoundingClientRect();
    const widthInMm = rect.width * 0.264583;
    const heightInMm = rect.height * 0.264583;

    const opt = {
      margin: 4,
      filename: `Vmanous_Workshop_Pass_${passId}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        letterRendering: true,
        windowWidth: document.documentElement.offsetWidth
      },
      jsPDF: { unit: 'mm', format: [widthInMm + 8, heightInMm + 8], orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] }
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
    <div className="bg-gray-50 min-h-screen pt-6 pb-10 flex items-center justify-center">
      <Container className="w-full">
        <div className="max-w-md mx-auto">

          {/* Header Success Message */}
          <div className="text-center mb-4">
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

          {/* Vertical Ticket / Pass Badge UI */}
          <motion.div
            id="workshop-pass-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xl relative"
          >
            {/* Top Pass Header Banner */}
            <div className="bg-white border-t-4 border-emerald-600 pt-3.5 pb-1 px-4 text-slate-800 text-center relative">
              <h2 className="text-base md:text-lg font-black tracking-wider uppercase mb-0.5 line-clamp-2 px-2 text-slate-800">
                {formData.institution || 'NATIONAL INSTITUTE OF TECHNOLOGY'}
              </h2>
              {formData.collegeAddress && (
                <p className="text-slate-500 text-xs font-semibold px-2 mb-0.5">
                  {formData.collegeAddress}
                </p>
              )}
              <p className="text-slate-400 text-[11px] font-bold tracking-widest">{passId}</p>
            </div>

            {/* Participant Profile & Info Section (Side-by-Side: Info on Left, Avatar on Right) */}
            <div className="p-4 flex items-center justify-between gap-4">
              {/* Left Side: Program Badge, Name & Contact Details */}
              <div className="flex-1 text-left space-y-1">
                <span className="inline-block text-[10px] sm:text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mb-0.5">
                  {formData.programInterest || 'AI Summit Workshop 2026'}
                </span>
                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">{fullName}</h3>

                {/* Mobile Number & Blood Group Info */}
                <div className="flex items-center gap-4 pt-1.5 mt-1">
                  {formData.phone && (
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Mobile Number</span>
                      <span className="text-[11px] font-semibold text-slate-700 block">{formData.phone}</span>
                    </div>
                  )}
                  {formData.bloodGroup && (
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Blood Group</span>
                      <span className="text-[11px] font-extrabold text-emerald-700 block">{formData.bloodGroup}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Selfie / Avatar Photo (Moved slightly left with mr-3) */}
              <div className="shrink-0 mr-3 sm:mr-4">
                {formData.selfie ? (
                  <img
                    src={formData.selfie}
                    alt={fullName}
                    className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-2 border-slate-300 shadow-md bg-white"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                    <svg
                      width="88"
                      height="88"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <circle cx="50" cy="50" r="50" fill="#E2E8F0" />
                      <circle cx="50" cy="38" r="17" fill="#94A3B8" />
                      <path d="M 16 92 A 36 36 0 0 1 84 92 Z" fill="#94A3B8" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Unique Center Accent Divider Line */}
            <div className="w-full flex items-center gap-3 my-1 px-4">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs ring-4 ring-emerald-100/70" />
              <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 via-slate-200 to-transparent" />
            </div>

            {/* Main Participant Academic Grid */}
            <div className="px-4 pt-1 pb-0">
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 bg-[#F8FAFC] rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Degree</span>
                  <span className="text-[11px] font-bold text-slate-800 truncate block mt-0.5">
                    {formData.degree || 'N/A'}
                  </span>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Specialization</span>
                  <span className="text-[11px] font-bold text-slate-800 truncate block mt-0.5">
                    {formData.branch || 'Computer Science'}
                  </span>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Semester</span>
                  <span className="text-[11px] font-bold text-slate-800 truncate block mt-0.5">
                    {formData.semester || formData.year || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Cutout Line */}
            <div className="relative flex items-center my-0">
              <div className="w-4 h-4 bg-gray-50 rounded-full border border-slate-200 -ml-2" />
              <div className="flex-1 border-b-2 border-dashed border-slate-300 mx-1" />
              <div className="w-4 h-4 bg-gray-50 rounded-full border border-slate-200 -mr-2" />
            </div>

            {/* Premium QR & Event Details Section */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-emerald-50/20 flex items-start justify-between gap-4">
              {/* Left Side: Date, Time, Official Status & PAID Seal */}
              <div className="space-y-2.5 flex-1 relative">
                {/* Red Circular PAID Stamp Seal */}
                <div className="absolute -top-1.5 right-7 pointer-events-none select-none">
                  <PaidStampSeal size={74} />
                </div>

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

              {/* Right Side: Prominent QR Code */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-36 h-36 sm:w-42 sm:h-42 bg-white p-1 flex items-center justify-center relative">
                  <QRCodeSVG
                    value={qrDataText}
                    size={136}
                    bgColor="#FFFFFF"
                    fgColor="#0F172A"
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
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
