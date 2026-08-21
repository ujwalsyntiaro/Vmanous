import React from 'react';
import LegalLayout from '../components/legal/LegalLayout';
import { CreditCard, DollarSign, Clock, ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <LegalLayout
      title="Refund Policy"
      subtitle="Clear details on refund eligibility, bank processing times, and non-refundable service terms."
      icon={CreditCard}
    >
      <section className="space-y-2">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <DollarSign className="text-vmanous-green flex-shrink-0" size={18} />
          1. General Policy & Registration Fees
        </h2>
        <p>
          At Vmanous Open Source (CIN: U62099PN2024PTC229219), registration fees paid for online/offline workshops, Power BI masterclasses, and AI Summits are non-refundable once enrollment passes are generated, except under the qualifying conditions listed below.
        </p>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <ShieldAlert className="text-vmanous-green flex-shrink-0" size={18} />
          2. Refund Eligibility Criteria
        </h2>
        <p>
          You are eligible for a 100% full refund under the following conditions:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Duplicate Transaction: You were charged multiple times for a single workshop registration due to a payment gateway glitch.</li>
          <li>Event Cancellation: A workshop or program is cancelled by Vmanous and no alternative dates/batches suit your schedule.</li>
          <li>Failed Pass Generation: Payment debited successfully from your account, but backend verification failed to generate your workshop pass/ticket within 48 hours.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <Clock className="text-vmanous-green flex-shrink-0" size={18} />
          3. Processing Timelines & Mode of Refund
        </h2>
        <p>
          Approved refund requests are initiated by our finance desk within 24 to 48 hours of verification.
        </p>
        <div className="bg-vmanous-light border border-gray-200 rounded-xl p-3.5 text-xs space-y-1 font-normal">
          <p className="font-medium text-vmanous-navy-dark">Refund Destination & Timelines:</p>
          <p className="text-gray-600">
            Refunds will be remitted to the original payment source (UPI, Debit/Credit Card, Net Banking via Razorpay). Banks typically take 5 to 7 business days to reflect the credit in your account balance.
          </p>
        </div>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark">
          4. Non-Refundable Scenarios
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Absenteeism or no-show during the scheduled workshop dates.</li>
          <li>Refund requests raised more than 7 days after the event completion date.</li>
          <li>Deciding not to complete the course/workshop after access has been provided.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark">
          5. Contact Finance Desk for Refund Support
        </h2>
        <p>
          For refund claims or payment assistance, please share your Razorpay Payment ID or Bank Transaction Slip with our team:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2 space-y-1.5 text-xs text-gray-700 font-normal">
          <p className="font-medium text-vmanous-navy-dark">Finance & Billing Desk</p>
          <p className="flex items-center gap-2"><MapPin size={14} className="text-vmanous-green flex-shrink-0" /> ABC Junction Sector 26 Nigdi Pradhikaran, Near Akurdi Railway Station, Pune - 411044</p>
          <p className="flex items-center gap-2"><Mail size={14} className="text-vmanous-green flex-shrink-0" /> info@vmanous.com</p>
          <p className="flex items-center gap-2"><Phone size={14} className="text-vmanous-green flex-shrink-0" /> +91 911 211 3322</p>
        </div>
      </section>
    </LegalLayout>
  );
};

export default RefundPolicy;
