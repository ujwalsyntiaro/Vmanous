import React from 'react';
import LegalLayout from '../components/legal/LegalLayout';
import { ShieldCheck, Eye, FileText, Lock, Users, Mail, Phone, MapPin } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="At Vmanous Open Source, we respect your privacy and are committed to protecting your personal data."
      icon={ShieldCheck}
    >
      <section className="space-y-2">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <Eye className="text-vmanous-green flex-shrink-0" size={18} />
          1. Information We Collect
        </h2>
        <p>
          When you interact with Vmanous Open Source (CIN: U62099PN2024PTC229219) through our platform, workshop forms, or college partnership applications, we collect the following types of information:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Personal Details: Full name, email address, contact number, and permanent/correspondence address.</li>
          <li>Academic & Professional Context: College/University name, academic stream, roll number, semester, and designation (for trainers & college leads).</li>
          <li>Payment & Billing Data: Transaction reference IDs, order status, and invoice records processed through accredited payment gateways (Razorpay). We never capture or store raw banking passwords, card PINs, or CVVs.</li>
          <li>Digital Diagnostics: Browser type, IP address, device fingerprints, and access timestamps to prevent fraudulent registrations.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <FileText className="text-vmanous-green flex-shrink-0" size={18} />
          2. How We Use Your Data
        </h2>
        <p>
          Your information is strictly used to fulfill educational services and manage institutional operations:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Registering you for AI Summits, Data Science masterclasses, Power BI workshops, and student internships.</li>
          <li>Generating verifiable QR passes and authentic certificates of completion.</li>
          <li>Sending critical updates regarding schedule changes, venue details, and certificate issuance via Email and WhatsApp/SMS.</li>
          <li>Verifying college partnership credentials for institutional alliances.</li>
          <li>Ensuring network security and compliance with legal obligations.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <Lock className="text-vmanous-green flex-shrink-0" size={18} />
          3. Security & Protection
        </h2>
        <p>
          We employ standard 256-bit SSL encryption for data in transit and secure database vaults for data at rest. Access to personal student information is strictly restricted to authorized administrative personnel.
        </p>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <Users className="text-vmanous-green flex-shrink-0" size={18} />
          4. Third-Party Sharing
        </h2>
        <p>
          Vmanous does not trade, sell, or rent student or institution data. Data is shared exclusively with:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Partner Institutions: Designated host colleges for verifying registered campus attendees.</li>
          <li>Authorized Infrastructure Providers: Payment processors (Razorpay) and verified transaction notification gateways.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark">
          5. Contact Details & Data Requests
        </h2>
        <p>
          For data access, correction requests, or privacy inquiries, contact our data protection team:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2 space-y-1.5 text-xs text-gray-700 font-normal">
          <p className="font-medium text-vmanous-navy-dark">Vmanous Open Source</p>
          <p className="flex items-center gap-2"><MapPin size={14} className="text-vmanous-green flex-shrink-0" /> ABC Junction Sector 26 Nigdi Pradhikaran, Near Akurdi Railway Station, Pune - 411044</p>
          <p className="flex items-center gap-2"><Mail size={14} className="text-vmanous-green flex-shrink-0" /> info@vmanous.com</p>
          <p className="flex items-center gap-2"><Phone size={14} className="text-vmanous-green flex-shrink-0" /> +91 911 211 3322</p>
        </div>
      </section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
