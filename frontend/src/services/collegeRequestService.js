// College AI Summit & Workshop Hosting Requests Service

const STORAGE_KEY = 'vmanous_college_requests';

export const getCollegeRequests = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error reading college requests:', e);
    return [];
  }
};

export const saveCollegeRequest = async (requestData) => {
  const newRequest = {
    id: `req_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Pending Contact',
    ...requestData
  };

  try {
    const existing = getCollegeRequests();
    const updated = [newRequest, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Try posting to backend API if available
    fetch('http://localhost:5000/api/v1/college-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    }).catch(err => console.log('Backend college-request notice:', err));

    return { success: true, data: newRequest };
  } catch (err) {
    console.error('Error saving college request:', err);
    return { success: false, error: err.message };
  }
};
