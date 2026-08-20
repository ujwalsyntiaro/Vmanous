import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, ShieldCheck, ArrowRight, Ticket } from 'lucide-react';
import { verifyPhonePeStatus } from '../services/paymentService';
import { saveApplications, getApplications } from '../services/applicationService';
import { saveStudents, getStudents } from '../services/studentService';

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const merchantTransactionId = searchParams.get('merchantTransactionId');

  const [loading, setLoading] = useState(true);
  const [statusResult, setStatusResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (!merchantTransactionId) {
      setErrorMsg('No Transaction ID found in payment callback URL');
      setLoading(false);
      return;
    }

    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    verifyPayment();
  }, [merchantTransactionId]);

  const verifyPayment = async () => {
    setLoading(true);
    setErrorMsg('');

    let pendingData = null;
    try {
      const stored = sessionStorage.getItem('vmanous_pending_payment');
      if (stored) pendingData = JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read cached form data', e);
    }

    try {
      const result = await verifyPhonePeStatus(merchantTransactionId, pendingData);

      if (result.success && result.data) {
        const appData = result.data;
        setStatusResult(appData);

        // Update local application state in localStorage without re-fetching/re-posting
        try {
          const currentApps = getApplications();
          if (!currentApps.some(a => a.transactionId === appData.transactionId || a.id === appData.id)) {
            saveApplications([appData, ...currentApps]);
          }

          const currentStudents = getStudents();
          const newStudent = {
            id: `stu_${Date.now()}`,
            studentName: appData.studentName,
            email: appData.email,
            phone: appData.phone,
            collegeName: appData.collegeName,
            programTitle: appData.programTitle,
            passCode: appData.passCode,
            paymentStatus: 'Paid',
            attendance: { day1: false, day2: false },
            enrolledAt: new Date().toISOString()
          };
          if (!currentStudents.some(s => s.email && s.email.toLowerCase() === appData.email.toLowerCase())) {
            saveStudents([newStudent, ...currentStudents]);
          }
        } catch (storageErr) {
          console.warn('Local state sync notice:', storageErr);
        }

        // Clean up temporary pending payment session data
        try {
          sessionStorage.removeItem('vmanous_pending_payment');
        } catch (e) {}

        const navigateToPass = () => {
          navigate('/pass', {
            state: {
              formData: {
                firstName: appData.studentName ? appData.studentName.split(' ')[0] : (pendingData?.firstName || 'Student'),
                lastName: appData.studentName ? appData.studentName.split(' ').slice(1).join(' ') : (pendingData?.lastName || ''),
                fullName: appData.studentName || pendingData?.studentName,
                email: appData.email || pendingData?.email,
                phone: appData.phone || pendingData?.phone,
                institution: appData.collegeName || pendingData?.institution,
                collegeAddress: appData.venueLocation || pendingData?.collegeAddress,
                programInterest: appData.programTitle || pendingData?.programInterest,
                degree: appData.degree || pendingData?.degree,
                branch: appData.branch || pendingData?.branch,
                semester: appData.year || appData.semester || pendingData?.semester || pendingData?.year,
                bloodGroup: appData.bloodGroup || pendingData?.bloodGroup,
                selfie: appData.selfiePhotoUrl || pendingData?.selfie,
                selfiePhotoUrl: appData.selfiePhotoUrl || pendingData?.selfiePhotoUrl,
                tenthPercentage: appData.marksTenth || pendingData?.tenthPercentage,
                twelfthPercentage: appData.marksTwelfth || pendingData?.twelfthPercentage,
                appliedDate: appData.createdAt || new Date().toISOString()
              },
              paymentId: appData.transactionId,
              passCode: appData.passCode
            }
          });
        };

        // Automatically redirect to Pass Page after 1.8s
        const timer = setTimeout(navigateToPass, 1800);
        return () => clearTimeout(timer);
      } else {
        setErrorMsg(result.error || 'Payment verification failed on PhonePe gateway');
      }
    } catch (err) {
      console.error('Callback error:', err);
      setErrorMsg('Failed to verify payment with server');
    } finally {
      setLoading(false);
    }
  };

  const handleManualPassRedirect = () => {
    if (!statusResult) return;
    navigate('/pass', {
      state: {
        formData: {
          firstName: statusResult.studentName ? statusResult.studentName.split(' ')[0] : 'Student',
          lastName: statusResult.studentName ? statusResult.studentName.split(' ').slice(1).join(' ') : '',
          fullName: statusResult.studentName,
          email: statusResult.email,
          phone: statusResult.phone,
          institution: statusResult.collegeName,
          collegeAddress: statusResult.venueLocation,
          programInterest: statusResult.programTitle,
          degree: statusResult.degree,
          branch: statusResult.branch,
          semester: statusResult.year || statusResult.semester,
          bloodGroup: statusResult.bloodGroup,
          selfie: statusResult.selfiePhotoUrl,
          selfiePhotoUrl: statusResult.selfiePhotoUrl,
          tenthPercentage: statusResult.marksTenth,
          twelfthPercentage: statusResult.marksTwelfth,
          appliedDate: statusResult.createdAt || new Date().toISOString()
        },
        paymentId: statusResult.transactionId,
        passCode: statusResult.passCode
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-gray-200 p-8 text-center"
      >
        {loading ? (
          <div className="space-y-5 py-6">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <ShieldCheck className="text-emerald-600" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Verifying PhonePe Payment</h2>
              <p className="text-xs text-slate-500">Please wait while we confirm your transaction and generate your digital pass...</p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-slate-400 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 truncate">
              Txn ID: {merchantTransactionId}
            </div>
          </div>
        ) : statusResult ? (
          <div className="space-y-4 py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Payment Successful!</h2>
            <p className="text-xs text-slate-600">
              Your payment of <strong className="text-slate-900">₹{statusResult.amountPaid || '2,359'}</strong> has been confirmed.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left text-xs space-y-1">
              <p className="font-bold text-emerald-900">Pass Code: {statusResult.passCode}</p>
              <p className="text-emerald-800 text-[11px]">Txn ID: {statusResult.transactionId}</p>
            </div>

            <p className="text-[11px] text-slate-400">Redirecting to your Digital Pass page...</p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleManualPassRedirect}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Ticket size={14} />
                <span>View Digital Pass</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <XCircle size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Payment Verification Issue</h2>
            <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>

            <div className="pt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  hasVerifiedRef.current = false;
                  verifyPayment();
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw size={14} />
                <span>Retry Verification</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/application')}
                className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Back to Registration</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallback;
