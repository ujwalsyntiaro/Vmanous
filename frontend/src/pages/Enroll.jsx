import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Send,
  ShieldCheck,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import Container from '../components/ui/Container';
import ProgramCard from '../components/ui/ProgramCard';
import EntryCodeModal from '../components/enroll/EntryCodeModal';
import { ENROLLMENT_FAQS } from '../constants/enrollment';
import { getSummits, fetchSummitsAsync, isSummitVisiblePublicly } from '../services/summitService';

const PROGRAM_OPTIONS = [
  { value: 'AI Summit', label: 'AI Summit' },
  { value: 'AI Research Lab', label: 'AI Research & Project Lab' },
  { value: 'College Campus Workshop', label: 'College Campus Partnership Program' },
  { value: 'Mentorship & Training', label: 'Expert Mentorship & Training' }
];

export const Enroll = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [upcomingSummits, setUpcomingSummits] = useState([]);
  const [selectedSummitForModal, setSelectedSummitForModal] = useState(null);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const handleRegisterClick = (summit) => {
    if (summit.entryCode) {
      // Check if already verified in this browser session
      const isAlreadyVerified = typeof window !== 'undefined' && sessionStorage.getItem(`verified_entry_summit_${summit.id}`) === 'true';
      if (isAlreadyVerified) {
        navigate('/application', { state: { programInterest: summit.title, summitDetails: summit, entryCodeVerified: true } });
        return;
      }

      setSelectedSummitForModal(summit);
      setIsEntryModalOpen(true);
    } else {
      // Free/Open Summit without Entry Code
      navigate('/application', { state: { programInterest: summit.title, summitDetails: summit } });
    }
  };

  const handleEntryCodeVerified = (summit) => {
    setIsEntryModalOpen(false);
    navigate('/application', { state: { programInterest: summit.title, summitDetails: summit, entryCodeVerified: true } });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadSummits = async () => {
      const data = await fetchSummitsAsync();
      setUpcomingSummits(data.filter(isSummitVisiblePublicly));
    };
    loadSummits();

    window.addEventListener("summits_updated", loadSummits);
    window.addEventListener("applications_updated", loadSummits);

    let bc = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("vmanous_live_updates");
      bc.onmessage = (msg) => {
        if (msg.data?.type === "SUMMIT_UPDATED") {
          loadSummits();
        }
      };
    }

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        loadSummits();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    const syncInterval = setInterval(() => {
      loadSummits();
    }, 4000);

    return () => {
      window.removeEventListener("summits_updated", loadSummits);
      window.removeEventListener("applications_updated", loadSummits);
      window.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      if (bc) bc.close();
      clearInterval(syncInterval);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 01 HERO BANNER */}
      <section className="relative h-[200px] sm:h-[260px] md:min-h-[35vh] flex items-center pt-10 pb-4 md:pt-20 md:pb-16 overflow-hidden bg-[#050816] text-white">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/network.jpg"
            alt="Network background"
            className="w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-[#050816]/70 to-[#050816]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-vmanous-green/15 rounded-full blur-[140px]" />
        </div>

        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 100 }}
              className="text-2xl md:text-4xl lg:text-5xl text-white tracking-wide mb-2 leading-tight"
            >
              Take the First Step Into the <br className="hidden md:block" />
              <span className="text-white">
                VMANOUS Ecosystem
              </span>
            </h1>
          </motion.div>
        </Container>
      </section>



      {/* 03 UPCOMING AI SUMMITS */}
      <section id="upcoming-summits" className="py-3 bg-gray-50/50">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-3">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">
                Upcoming Programs
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {upcomingSummits.map((summit, index) => (
                <div key={summit.id} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                  <ProgramCard
                    summit={summit}
                    index={index}
                    onRegister={handleRegisterClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>


      {/* 04 ECOSYSTEM WORKFLOW TIMELINE */}
      <section className="py-10 bg-white border-y border-gray-200">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-vmanous-navy-dark mb-2">
              How Enrollment Works
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              A transparent, outcome-oriented workflow designed for maximum practical growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Submit Application', desc: 'Select your role and submit the enrollment form with your details.' },
              { num: '02', title: 'Orientation & Review', desc: 'Our academic team reviews your profile and completes onboarding.' },
              { num: '03', title: 'Hands-on Learning', desc: 'Engage in AI Summit programs, project labs, and data science workflows.' },
              { num: '04', title: 'Evaluation & Pathways', desc: 'Gain skill certifications, research exposure, and internship pathways.' }
            ].map((step, idx) => (
              <div key={idx} className="relative p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="text-2xl font-black text-vmanous-green mb-2">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-vmanous-navy-dark mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 05 ENTRY CODE VERIFICATION MODAL */}
      <EntryCodeModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        summit={selectedSummitForModal}
        onSuccess={handleEntryCodeVerified}
      />
    </div>
  );
};

export default Enroll;
