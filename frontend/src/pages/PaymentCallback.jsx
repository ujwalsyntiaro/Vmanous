import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Ticket,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  Home
} from 'lucide-react';
import { verifyCashfreeStatus } from '../services/paymentService';
import { saveApplications, getApplications } from '../services/applicationService';
import { saveStudents, getStudents } from '../services/studentService';
import { broadcastSummitUpdate } from '../services/summitService';

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId') || searchParams.get('merchantTransactionId');

  const [loading, setLoading] = useState(true);
  const [statusResult, setStatusResult] = useState(null);
  const [failedData, setFailedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setErrorMsg('No Order / Transaction ID found in payment callback URL');
      setLoading(false);
      return;
    }

    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    verifyPayment();
  }, [orderId]);

  const verifyPayment = async () => {
    setLoading(true);
    setErrorMsg('');
    setFailedData(null);

    let pendingData = null;
    try {
      const stored = sessionStorage.getItem('vmanous_pending_payment');
      if (stored) pendingData = JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read cached form data', e);
    }

    try {
      const result = await verifyCashfreeStatus(orderId, pendingData);

      if (result.success && result.data) {
        const appData = result.data;
        setStatusResult(appData);

        // Update local application state in localStorage
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
          // Trigger live reactive update events across all open windows & tabs
          broadcastSummitUpdate();
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
                appliedDate: appData.createdAt || new Date().toISOString(),
                paymentStatus: 'Paid',
                amountPaid: (appData.amountPaid !== undefined && appData.amountPaid !== null) ? Number(appData.amountPaid) : (pendingData?.amountPaid ?? pendingData?.totalAmount ?? 0),
                baseAmount: (appData.baseAmount !== undefined && appData.baseAmount !== null) ? Number(appData.baseAmount) : (pendingData?.baseAmount ?? null),
                gstAmount: (appData.gstAmount !== undefined && appData.gstAmount !== null) ? Number(appData.gstAmount) : (pendingData?.gstAmount ?? null),
                platformFee: (appData.platformFee !== undefined && appData.platformFee !== null) ? Number(appData.platformFee) : (pendingData?.platformFee ?? 0),
                summitId: appData.summitId || pendingData?.summitId || null,
                transactionId: appData.transactionId || pendingData?.transactionId || appData.passCode,
                passCode: appData.passCode || pendingData?.passCode
              },
              paymentId: appData.transactionId,
              passCode: appData.passCode,
              summitDetails: pendingData?.summitDetails || null
            }
          });
        };

        // Automatically redirect to Pass Page after 1.8s
        const timer = setTimeout(navigateToPass, 1800);
        return () => clearTimeout(timer);
      } else {
        // Payment is strictly FAILED
        const reason = result.error || (result.paymentCode ? `Gateway status: ${result.paymentCode}` : 'Transaction Cancelled / Declined');
        setErrorMsg(reason);
        setFailedData({
          ...pendingData,
          transactionId: merchantTransactionId,
          failureReason: reason,
          amountPaid: result.amountPaid || pendingData?.totalAmount || pendingData?.amountPaid || 0,
          programTitle: result.programTitle || pendingData?.programInterest || 'AI Summit Workshop',
          collegeName: result.collegeName || pendingData?.institution || 'Partner College'
        });
      }
    } catch (err) {
      console.error('Callback error:', err);
      setErrorMsg('Failed to communicate with payment verification server');
      setFailedData(pendingData ? { ...pendingData, transactionId: merchantTransactionId } : null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = () => {
    let pendingData = failedData;
    if (!pendingData) {
      try {
        const stored = sessionStorage.getItem('vmanous_pending_payment');
        if (stored) pendingData = JSON.parse(stored);
      } catch (e) {}
    }

    if (pendingData) {
      navigate('/payment', {
        state: {
          formData: pendingData,
          summitDetails: pendingData.summitDetails || null
        }
      });
    } else {
      navigate('/enroll');
    }
  };

  const handleEditApplication = () => {
    let pendingData = failedData;
    if (!pendingData) {
      try {
        const stored = sessionStorage.getItem('vmanous_pending_payment');
        if (stored) pendingData = JSON.parse(stored);
      } catch (e) {}
    }

    if (pendingData) {
      navigate('/application', {
        state: { formData: pendingData }
      });
    } else {
      navigate('/enroll');
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
          appliedDate: statusResult.createdAt || new Date().toISOString(),
          paymentStatus: 'Paid',
          amountPaid: (statusResult.amountPaid !== undefined && statusResult.amountPaid !== null) ? Number(statusResult.amountPaid) : 0,
          baseAmount: (statusResult.baseAmount !== undefined && statusResult.baseAmount !== null) ? Number(statusResult.baseAmount) : null,
          gstAmount: (statusResult.gstAmount !== undefined && statusResult.gstAmount !== null) ? Number(statusResult.gstAmount) : null,
          platformFee: (statusResult.platformFee !== undefined && statusResult.platformFee !== null) ? Number(statusResult.platformFee) : 0,
          summitId: statusResult.summitId || null,
          transactionId: statusResult.transactionId || statusResult.passCode,
          passCode: statusResult.passCode
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
        className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 text-center"
      >
        {loading ? (
          <div className="space-y-5 py-6">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <ShieldCheck className="text-emerald-600" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Verifying Payment Status</h2>
              <p className="text-xs text-slate-500">Please wait while we confirm your Cashfree transaction status...</p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-slate-400 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 truncate">
              Order ID: {orderId}
            </div>
          </div>
        ) : statusResult ? (
          <div className="space-y-4 py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Payment Successful!</h2>
            <p className="text-xs text-slate-600">
              Your payment of <strong className="text-slate-900">₹{statusResult.amountPaid ? Number(statusResult.amountPaid).toLocaleString('en-IN') : '3,539'}</strong> has been confirmed.
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
          /* Payment Failed State */
          <div className="space-y-4 py-3 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <XCircle size={36} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">Payment Failed</h2>
              <p className="text-xs text-slate-500 mt-1">
                Your transaction was not completed. No workshop pass has been generated.
              </p>
            </div>

            {/* Error Message & Details Card */}
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <p className="text-rose-800 font-semibold leading-tight">
                  {errorMsg || 'The payment gateway reported a failed or cancelled transaction.'}
                </p>
              </div>

              <div className="border-t border-rose-200/60 pt-2 space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-700 truncate max-w-[180px]">{orderId}</span>
                </div>
                {failedData?.programTitle && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Program:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[180px]">{failedData.programTitle}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-slate-800">₹{failedData?.amountPaid ? Number(failedData.amountPaid).toLocaleString('en-IN') : '3,539'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-rose-600 uppercase">Not Registered / Failed</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              If money was debited from your bank account, it will be automatically refunded by Cashfree / your bank within 3-5 business days.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleRetryPayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-[0.99]"
              >
                <RotateCcw size={15} />
                <span>Retry Payment</span>
              </button>

              <button
                type="button"
                onClick={handleEditApplication}
                className="w-full py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Edit Application Details</span>
              </button>

              <Link
                to="/"
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors pt-1 inline-flex items-center justify-center gap-1"
              >
                <Home size={13} />
                <span>Return to Homepage</span>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallback;
