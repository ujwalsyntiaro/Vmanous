import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, MapPin, User, Download, Home, QrCode } from 'lucide-react';
import Container from '../components/ui/Container';

export const Pass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const paymentId = location.state?.paymentId;

  useEffect(() => {
    if (!formData) {
      navigate('/enroll');
    }
  }, [formData, navigate]);

  if (!formData) return null;

  return (
    <div className="bg-[#050816] min-h-screen pt-24 pb-12 relative overflow-hidden flex items-center justify-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-vmanous-green/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-16 h-16 bg-vmanous-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-vmanous-green/20"
            >
              <CheckCircle2 size={32} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400">Your digital pass has been generated.</p>
          </div>

          {/* Ticket / Pass UI */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-vmanous-green to-emerald-600 p-6 text-white text-center">
              <h2 className="text-xl font-bold tracking-widest uppercase mb-1">Vmanous Workshop Pass</h2>
              <p className="text-emerald-100 text-sm">{paymentId || 'TKT-0019283'}</p>
            </div>

            <div className="p-8 flex flex-col md:flex-row gap-8 items-center justify-between relative">
              {/* Perforation holes decoration */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#050816] rounded-full border border-white/10" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#050816] rounded-full border border-white/10" />

              <div className="flex-1 space-y-6 w-full">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Program</p>
                  <h3 className="text-xl font-bold text-white">{formData.programInterest}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><User size={12}/> Participant</p>
                    <p className="text-white font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12}/> Institution</p>
                    <p className="text-white font-medium">{formData.institution || 'N/A'}</p>
                  </div>
                </div>

                {formData.branch && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Branch</p>
                      <p className="text-white font-medium">{formData.branch}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Year</p>
                      <p className="text-white font-medium">{formData.year}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-300">
                  <span className="flex items-center gap-2"><Calendar size={14} className="text-vmanous-green"/> Upcoming Date</span>
                  <span className="text-vmanous-green font-medium">To be announced via Email</span>
                </div>
              </div>

              {/* QR Code section */}
              <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/10 shrink-0">
                <div className="w-32 h-32 bg-white p-2 rounded-lg mb-2 flex items-center justify-center">
                   <QrCode size={100} className="text-[#050816]"/>
                </div>
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">Scan at entry</p>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2">
              <Download size={18} />
              Download PDF Pass
            </button>
            <Link to="/" className="px-6 py-3 bg-vmanous-green hover:bg-emerald-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
              <Home size={18} />
              Return to Homepage
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default Pass;
