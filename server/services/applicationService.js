// Application & Failed Payment Lead Management Service

const INITIAL_APPLICATIONS = [];

export const getApplications = () => {
  const stored = localStorage.getItem('vmanous_applications');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
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
