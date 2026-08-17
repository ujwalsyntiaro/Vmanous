import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import Container from '../components/ui/Container';

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    // If no state is found, redirect back to enroll
    if (!location.state || !location.state.formData) {
      navigate('/enroll');
    } else {
      setFormData(location.state.formData);
    }
  }, [location, navigate]);

  if (!formData) return null;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/pass', { state: { formData, paymentId: 'PAY' + Math.floor(Math.random() * 1000000) } });
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Form</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CreditCard className="text-vmanous-green" />
                  Payment Details
                </h2>

                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-vmanous-green bg-emerald-50 text-vmanous-green' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                      paymentMethod === 'upi' 
                        ? 'border-vmanous-green bg-emerald-50 text-vmanous-green' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    UPI / QR
                  </button>
                </div>

                <form onSubmit={handlePayment} className="space-y-5">
                  {paymentMethod === 'card' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Name on card"
                          defaultValue={formData.fullName}
                          className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm focus:border-vmanous-green outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm focus:border-vmanous-green outline-none tracking-widest"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm focus:border-vmanous-green outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="***"
                            maxLength="4"
                            className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm focus:border-vmanous-green outline-none"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">QR Code<br/>Placeholder</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">Scan using any UPI App</p>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 text-left">
                          Or enter UPI ID
                        </label>
                        <input
                          type="text"
                          placeholder="username@upi"
                          className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-slate-800 text-sm focus:border-vmanous-green outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-4 bg-vmanous-green hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Pay ₹1,999 Securely
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Payments are secure and encrypted
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{formData.programInterest}</p>
                      <p className="text-xs text-slate-500 mt-1">Workshop Enrollment Fee</p>
                    </div>
                    <span className="text-sm font-bold text-slate-800">₹1,999</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between items-center text-sm mb-2 text-slate-600">
                    <span>Subtotal</span>
                    <span>₹1,999</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2 text-slate-600">
                    <span>Taxes & Fees</span>
                    <span>₹0</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-slate-800">Total</span>
                  <span className="text-xl font-black text-vmanous-green">₹1,999</span>
                </div>

                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-xs flex items-start gap-3">
                  <CheckCircle2 size={24} className="text-blue-500 flex-shrink-0" />
                  <p>
                    By completing this payment, you will instantly receive your digital workshop pass and email confirmation.
                  </p>
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
