import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react';
import { verifyPhonePeStatus } from '../services/paymentService';
import { addApplication } from '../services/applicationService';
import { addStudent } from '../services/studentService';

export const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const merchantTransactionId = searchParams.get('merchantTransactionId');

  const [loading, setLoading] = useState(true);
  const [statusResult, setStatusResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!merchantTransactionId) {
      setErrorMsg('No Transaction ID found in payment callback URL');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [merchantTransactionId]);

  const verifyPayment = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      const result = await verifyPhonePeStatus(merchantTransactionId);

      if (result.success && result.data) {
        const appData = result.data;
        setStatusResult(appData);

        // Sync with local frontend state stores
        addApplication(appData);
        addStudent({
          studentName: appData.studentName,
          email: appData.email,
          phone: appData.phone,
          collegeName: appData.collegeName,
          programTitle: appData.programTitle,
          passCode: appData.passCode
        });

        // Automatically redirect to Pass Page after 1.5s
        setTimeout(() => {
          navigate('/pass', {
            state: {
              formData: {
                firstName: appData.studentName.split(' ')[0],
                lastName: appData.studentName.split(' ').slice(1).join(' '),
                email: appData.email,
                phone: appData.phone,
                institution: appData.collegeName,
                collegeAddress: appData.venueLocation,
                programInterest: appData.programTitle,
                degree: appData.degree,
                branch: appData.branch,
                semester: appData.year || appData.semester,
                bloodGroup: appData.bloodGroup,
                selfie: appData.selfiePhotoUrl
              },
              paymentId: appData.transactionId,
              passCode: appData.passCode
            }
          });
        }, 1500);
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
              Your PhonePe payment of <strong className="text-slate-900">₹{statusResult.amountPaid}</strong> has been confirmed.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left text-xs space-y-1">
              <p className="font-bold text-emerald-900">Pass Code: {statusResult.passCode}</p>
              <p className="text-emerald-800 text-[11px]">Txn ID: {statusResult.transactionId}</p>
            </div>

            <p className="text-[11px] text-slate-400">Redirecting to your Digital Pass page...</p>
          </div>
        ) : (
          <div className="space-y-4 py-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <XCircle size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Payment Failed / Cancelled</h2>
            <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => navigate('/application')}
                className="w-full py-2.5 bg-[#2D73B4] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Retry Registration</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallback;
