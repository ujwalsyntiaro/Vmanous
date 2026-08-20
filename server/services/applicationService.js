// Application & Failed Payment Lead Management Service

const INITIAL_APPLICATIONS = [
  {
    id: 'app_101',
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9876543210',
    programTitle: 'AI SUMMIT WORKSHOP 2030',
    collegeName: 'G H Raisoni College of Engineering',
    venueLocation: 'Main Auditorium, Nagpur Campus',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '88.5%',
    marksTwelfth: '85.0%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124871',
    amountPaid: 2358.82,
    passCode: 'PASS-GHRCEM-801',
    createdAt: '2026-08-18T10:15:30Z'
  },
  {
    id: 'app_102',
    studentName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 9823456789',
    programTitle: 'AI SUMMIT WORKSHOP 2030',
    collegeName: 'National Institute of Technology',
    venueLocation: 'NIT Campus Auditorium, Trichy',
    branch: 'Artificial Intelligence & Data Science',
    year: '4th Year',
    degree: 'B.Tech',
    marksTenth: '92.0%',
    marksTwelfth: '91.4%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Verified',
    transactionId: 'TXN_998124872',
    amountPaid: 2358.82,
    passCode: 'PASS-NIT-802',
    createdAt: '2026-08-18T11:20:00Z'
  },
  {
    id: 'app_103',
    studentName: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    phone: '+91 9711223344',
    programTitle: 'AI Research Lab Bootcamp',
    collegeName: 'G H Raisoni College of Engineering',
    venueLocation: 'Main Auditorium, Nagpur Campus',
    branch: 'Information Technology',
    year: '2nd Year',
    degree: 'B.Tech',
    marksTenth: '82.0%',
    marksTwelfth: '80.5%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Failed',
    paymentFailureReason: 'Bank Server Timeout / Transaction Cancelled',
    verificationStatus: 'Pending Audit',
    transactionId: 'TXN_FAIL_99182',
    amountPaid: 0,
    passCode: null,
    createdAt: '2026-08-18T14:45:10Z'
  },
  {
    id: 'app_104',
    studentName: 'Ananya Verma',
    email: 'ananya.v@example.com',
    phone: '+91 9654321098',
    programTitle: 'AI SUMMIT WORKSHOP 2030',
    collegeName: 'Indian Institute of Technology Bombay',
    venueLocation: 'Victor Menezes Convention Centre',
    branch: 'Computer Science',
    year: '3rd Year',
    degree: 'B.Tech',
    marksTenth: '95.6%',
    marksTwelfth: '94.2%',
    selfiePhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    paymentStatus: 'Paid',
    verificationStatus: 'Pending Audit',
    transactionId: 'TXN_998124874',
    amountPaid: 2358.82,
    passCode: 'PASS-IITB-804',
    createdAt: '2026-08-18T15:30:00Z'
  }
];

export const getApplications = () => {
  const stored = localStorage.getItem('vmanous_applications');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('vmanous_applications', JSON.stringify(INITIAL_APPLICATIONS));
  return INITIAL_APPLICATIONS;
};

export const saveApplications = (apps) => {
  localStorage.setItem('vmanous_applications', JSON.stringify(apps));
};

export const addApplication = (appData) => {
  const apps = getApplications();
  const newApp = {
    id: `app_${Date.now()}`,
    createdAt: new Date().toISOString(),
    verificationStatus: 'Pending Audit',
    ...appData
  };
  const updated = [newApp, ...apps];
  saveApplications(updated);
  return newApp;
};

export const updateVerificationStatus = (id, status) => {
  const apps = getApplications();
  const updated = apps.map((app) => (app.id === id ? { ...app, verificationStatus: status } : app));
  saveApplications(updated);
  return updated;
};

export const deleteApplication = (id) => {
  const apps = getApplications();
  const updated = apps.filter((app) => app.id !== id);
  saveApplications(updated);
  return updated;
};

export const exportApplicationsToCSV = (apps) => {
  if (!apps || apps.length === 0) return;
  const headers = ['ID', 'Student Name', 'Email', 'Phone', 'College Name', 'Venue Location', 'Program Title', 'Payment Status', 'Verification Status', 'Transaction ID', 'Amount Paid', 'Date'];
  const rows = apps.map(a => [
    a.id,
    `"${a.studentName || ''}"`,
    a.email || '',
    a.phone || '',
    `"${a.collegeName || ''}"`,
    `"${a.venueLocation || ''}"`,
    `"${a.programTitle || ''}"`,
    a.paymentStatus || '',
    a.verificationStatus || '',
    a.transactionId || '',
    a.amountPaid || 0,
    a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ''
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `VMANOUS_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
