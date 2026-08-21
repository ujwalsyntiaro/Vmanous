import React from 'react';
import LegalLayout from '../components/legal/LegalLayout';
import { XCircle, Calendar, RefreshCw, AlertTriangle, Mail, Phone, MapPin } from 'lucide-react';

const CancellationPolicy = () => {
  return (
    <LegalLayout
      title="Cancellation Policy"
      subtitle="Guidelines on cancellation procedures for workshop registrations, student passes, and campus partnerships."
      icon={XCircle}
    >
      <section className="space-y-2">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <Calendar className="text-vmanous-green flex-shrink-0" size={18} />
          1. Student / Participant Registration Cancellations
        </h2>
        <p>
          We understand that unforeseen conflicts can arise. The cancellation window for registered students depends on when the request is received:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>More than 48 Hours Prior: Written cancellation requests received at least 48 hours before the workshop start time qualify for a batch transfer or full event credit valid for 6 months.</li>
          <li>Less than 48 Hours Prior: Cancellations made within 48 hours of the event start time cannot be processed, as mentor schedules, venue capacity, and pass allocations are locked.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <RefreshCw className="text-vmanous-green flex-shrink-0" size={18} />
          2. Event Rescheduling or Cancellation by Vmanous
        </h2>
        <p>
          In rare circumstances such as severe weather events, trainer illness, or technical issues beyond control, Vmanous Open Source reserves the right to reschedule or cancel a session.
        </p>
        <p>
          In such cases, registered participants are entitled to:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Direct enrollment in the rescheduled date or equivalent workshop.</li>
          <li>A 100% full refund if the new schedule does not fit your availability.</li>
        </ul>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark flex items-center gap-2">
          <AlertTriangle className="text-vmanous-green flex-shrink-0" size={18} />
          3. Institutional & College Partnership Cancellations
        </h2>
        <p>
          Colleges or universities partnering with Vmanous for campus workshops or AI Summits must provide a minimum of 7 business days written notice for event date modifications or cancellations to prevent logistics forfeiture.
        </p>
      </section>

      <section className="space-y-2 border-t border-gray-100 pt-4">
        <h2 className="text-base md:text-lg font-medium text-vmanous-navy-dark">
          4. Submitting a Cancellation Notice
        </h2>
        <p>
          To submit a cancellation notice, please email our support desk with your full name, registered email address, transaction reference ID, and workshop batch details:
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2 space-y-1.5 text-xs text-gray-700 font-normal">
          <p className="font-medium text-vmanous-navy-dark">Cancellation Help Desk</p>
          <p className="flex items-center gap-2"><MapPin size={14} className="text-vmanous-green flex-shrink-0" /> ABC Junction Sector 26 Nigdi Pradhikaran, Near Akurdi Railway Station, Pune - 411044</p>
          <p className="flex items-center gap-2"><Mail size={14} className="text-vmanous-green flex-shrink-0" /> info@vmanous.com</p>
          <p className="flex items-center gap-2"><Phone size={14} className="text-vmanous-green flex-shrink-0" /> +91 911 211 3322</p>
        </div>
      </section>
    </LegalLayout>
  );
};

export default CancellationPolicy;
