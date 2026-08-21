import React from 'react';
import LegalLayout from '../components/legal/LegalLayout';
import { Scale, CheckCircle2, AlertCircle, FileCode, MapPin, Mail, Phone } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <LegalLayout
      title="Terms & Conditions"
      subtitle="Terms governing the use of Vmanous Open Source website, workshop passes, and educational programs."
      icon={Scale}
    >
      <section className="space-y-2">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <CheckCircle2 className="text-vmanous-green flex-shrink-0" size={18} />
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using the platform at vmanous.com or registering for any workshop, AI summit, or technical program hosted by Vmanous Open Source (CIN: U62099PN2024PTC229219), you agree to comply with and be bound by these Terms and Conditions.
        </p>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <AlertCircle className="text-vmanous-green flex-shrink-0" size={18} />
          2. User Registration & Conduct
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Participants must submit true, current, and complete details during enrollment.</li>
          <li>Workshop QR passes issued to registered students are non-transferable. Presenting fake credentials or sharing passes may lead to immediate cancellation without refund.</li>
          <li>Participants must adhere to decorum during live sessions, campus events, and online webinars. Disruptive behavior will result in removal from the program.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <FileCode className="text-vmanous-green flex-shrink-0" size={18} />
          3. Intellectual Property Rights
        </h2>
        <p>
          All workshop materials, power BI dashboards, sample datasets, slide decks, and code repositories created by Vmanous belong to Vmanous Open Source. You are granted a limited, personal, non-commercial license to use these materials for learning purposes only.
        </p>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark">
          4. Payments & Billing
        </h2>
        <p>
          Prices for workshops and programs are clearly stated in Indian Rupees (INR). Fees must be paid through official Vmanous transaction links. Registration fees are non-refundable except under explicit circumstances outlined in our Refund Policy.
        </p>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark">
          5. Governing Law & Dispute Resolution
        </h2>
        <p>
          These terms are governed by the laws of India. Any legal dispute or suit arising out of these terms shall fall under the exclusive jurisdiction of competent courts in Pune, Maharashtra, India.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2 space-y-1.5 text-xs text-gray-700 font-normal">
          <p className="font-medium text-vmanous-navy-dark">Legal Desk — Vmanous Open Source</p>
          <p className="flex items-center gap-2"><MapPin size={14} className="text-vmanous-green flex-shrink-0" /> ABC Junction Sector 26 Nigdi Pradhikaran, Near Akurdi Railway Station, Pune - 411044</p>
          <p className="flex items-center gap-2"><Mail size={14} className="text-vmanous-green flex-shrink-0" /> info@vmanous.com</p>
          <p className="flex items-center gap-2"><Phone size={14} className="text-vmanous-green flex-shrink-0" /> +91 911 211 3322</p>
        </div>
      </section>
    </LegalLayout>
  );
};

export default TermsAndConditions;
