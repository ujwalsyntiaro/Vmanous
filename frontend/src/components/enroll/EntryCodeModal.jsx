import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, CheckCircle2, AlertCircle, X, ArrowRight, Building2, Sparkles, Loader2 } from 'lucide-react';
import { verifyEntryCodeAsync } from '../../services/summitService';

export const EntryCodeModal = ({ isOpen, onClose, summit, onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
      setIsLoading(false);
      setIsSuccess(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 150);
    }
  }, [isOpen, summit]);

  if (!isOpen || !summit) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError('Please enter the Workshop Entry Code.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check direct client-side match if available on summit object
      if (summit.entryCode) {
        const expected = String(summit.entryCode).trim().toUpperCase();
        if (trimmedCode === expected) {
          handleVerificationSuccess();
          return;
        }
      }

      // 2. Also verify against backend API for security & live sync
      const res = await verifyEntryCodeAsync(summit.id, trimmedCode);
      if (res && res.valid) {
        handleVerificationSuccess();
      } else {
        setError(res?.error || 'Invalid Entry Code. Please enter the valid code provided by your college/institution.');
        setIsLoading(false);
        if (inputRef.current) inputRef.current.focus();
      }
    } catch (err) {
      setError('Network error verifying code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setIsSuccess(true);
    setIsLoading(false);

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(`verified_entry_summit_${summit.id}`, 'true');
      } catch (e) { }
    }

    setTimeout(() => {
      if (onSuccess) onSuccess(summit);
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#050816]/75 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Light Clean Header */}
          <div className="bg-white p-5 border-b border-slate-100 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Enter Workshop Entry Code
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Protected Enrollment Access
                </p>
              </div>
            </div>

            {/* Summit & College Badge */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50/70 px-3 py-2 rounded-lg border border-emerald-200/80">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">
                {summit.title} {summit.college ? `• ${summit.college}` : ''}
              </span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {isSuccess ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-6 flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Entry Code Verified!
                </h4>
                <p className="text-xs text-slate-600">
                  Opening Application Form...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please enter the exclusive <strong className="text-slate-900">Workshop Entry Code</strong> provided by your institution/college coordinator to unlock the registration form.
                </p>

                {/* Error Banner with Shake Animation */}
                {error && (
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: [0, -6, 6, -4, 4, 0], opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs font-semibold text-red-700 shadow-2xs"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-snug">{error}</span>
                  </motion.div>
                )}

                {/* Code Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    College Entry Code
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setError('');
                        setCode(e.target.value.toUpperCase().replace(/\s+/g, ''));
                      }}
                      placeholder=""
                      className="w-full h-11 pl-10 pr-4 font-mono text-sm font-bold tracking-widest uppercase bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 outline-none text-slate-900 placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 transition-all shadow-inner"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Submit & Cancel Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !code.trim()}
                    className="flex-1 h-10 px-4 rounded-xl border border-emerald-600 hover:border-2 hover:border-emerald-700 bg-white hover:bg-emerald-50/50 text-emerald-700 hover:text-emerald-800 text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Proceed</span>
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EntryCodeModal;
