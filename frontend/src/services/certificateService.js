// Certificate API Service for CPanel

export const fetchWorkshopsForCertificates = async () => {
  try {
    const res = await fetch('/api/v1/certificates/workshops');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
  } catch (err) {
    console.warn('Backend fetch notice for certificate workshops:', err);
  }

  // Fallback to local summits if network error
  const local = localStorage.getItem('vmanous_summits');
  if (local) {
    try {
      const summits = JSON.parse(local);
      const apps = JSON.parse(localStorage.getItem('vmanous_applications') || '[]');
      return summits.map(s => {
        const paidApps = apps.filter(a => Number(a.summitId) === Number(s.id) && a.paymentStatus === 'Paid');
        return {
          id: s.id,
          title: s.title,
          college: s.college,
          address: s.address,
          seatCapacity: s.seatCapacity || 100,
          enrolledCount: paidApps.length,
          isSeatsFull: paidApps.length >= (s.seatCapacity || 100),
          status: s.status,
          date: s.date || s.startDate,
          startDate: s.startDate,
          time: s.time,
          certificates: {
            totalEligible: paidApps.length,
            sentCount: 0,
            failedCount: 0,
            pendingCount: paidApps.length
          }
        };
      });
    } catch (e) {}
  }
  return [];
};

export const fetchWorkshopStudents = async (summitId) => {
  try {
    const res = await fetch(`/api/v1/certificates/students/${summitId}`);
    const json = await res.json();
    if (json.success) {
      return json;
    }
  } catch (err) {
    console.warn('Backend fetch notice for workshop students:', err);
  }

  // Local fallback
  const apps = JSON.parse(localStorage.getItem('vmanous_applications') || '[]');
  const filtered = apps.filter(a => Number(a.summitId) === Number(summitId) && a.paymentStatus === 'Paid');
  return {
    success: true,
    summit: { id: summitId },
    data: filtered.map(a => ({
      id: a.id,
      applicationId: a.id,
      studentName: a.studentName,
      email: a.email,
      phone: a.phone,
      collegeName: a.collegeName,
      branch: a.branch || 'Computer Science',
      year: a.year || '3rd Year',
      passCode: a.passCode,
      paymentStatus: a.paymentStatus,
      createdAt: a.createdAt,
      certificate: {
        certificateCode: `VM-CERT-2026-${a.id.slice(0, 4).toUpperCase()}`,
        status: 'Pending',
        errorMessage: null,
        sentAt: null
      }
    }))
  };
};

export const sendBulkCertificatesApi = async (summitId, studentIds) => {
  try {
    const res = await fetch('/api/v1/certificates/send-bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ summitId, studentIds })
    });
    return await res.json();
  } catch (err) {
    console.error('Error sending bulk certificates:', err);
    return {
      success: false,
      error: 'Network / Server Error while sending certificates'
    };
  }
};

export const getCertificatePdfUrl = (applicationId) => {
  return `/api/v1/certificates/preview-pdf/${applicationId}`;
};
