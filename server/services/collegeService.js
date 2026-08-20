// Partner Colleges & Campus Seat Management Service

const INITIAL_COLLEGES = [
  {
    id: 'col_101',
    name: 'G H Raisoni College of Engineering',
    shortCode: 'GHRCEM',
    city: 'Nagpur',
    state: 'Maharashtra',
    address: 'Hingna Road, Digdoh Hills, Nagpur - 440016',
    mouStatus: 'Active MOU',
    mouSignedDate: '2026-01-15',
    contactPerson: 'Dr. Rajesh Kumar',
    contactEmail: 'rajesh.kumar@ghrcem.raisoni.net',
    contactPhone: '+91 9876543210',
    totalSeatLimit: 100
  },
  {
    id: 'col_102',
    name: 'National Institute of Technology',
    shortCode: 'NITT',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    address: 'Tanjore Main Road, National Highway 67, Tiruchirappalli',
    mouStatus: 'Active MOU',
    mouSignedDate: '2025-11-20',
    contactPerson: 'Prof. S. Venkatesh',
    contactEmail: 'venkatesh@nitt.edu',
    contactPhone: '+91 9823456789',
    totalSeatLimit: 100
  },
  {
    id: 'col_103',
    name: 'Indian Institute of Technology Bombay',
    shortCode: 'IITB',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Main Gate Rd, IIT Area, Powai, Mumbai - 400076',
    mouStatus: 'Active MOU',
    mouSignedDate: '2026-02-01',
    contactPerson: 'Dr. Anita Joshi',
    contactEmail: 'anita.joshi@iitb.ac.in',
    contactPhone: '+91 9988776655',
    totalSeatLimit: 150
  },
  {
    id: 'col_104',
    name: 'College of Engineering Pune',
    shortCode: 'COEP',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Wellesley Rd, Shivajinagar, Pune - 411005',
    mouStatus: 'In Discussion',
    mouSignedDate: '2026-03-10',
    contactPerson: 'Prof. Milind Patil',
    contactEmail: 'milind.patil@coep.ac.in',
    contactPhone: '+91 9765432100',
    totalSeatLimit: 100
  }
];

export const getColleges = () => {
  const stored = localStorage.getItem('vmanous_colleges');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('vmanous_colleges', JSON.stringify(INITIAL_COLLEGES));
  return INITIAL_COLLEGES;
};

export const saveColleges = (colleges) => {
  localStorage.setItem('vmanous_colleges', JSON.stringify(colleges));
};

export const addCollege = (collegeData) => {
  const colleges = getColleges();
  const newCollege = {
    id: `col_${Date.now()}`,
    totalSeatLimit: Number(collegeData.totalSeatLimit) || 100,
    mouStatus: collegeData.mouStatus || 'Active MOU',
    ...collegeData
  };
  const updated = [newCollege, ...colleges];
  saveColleges(updated);
  return newCollege;
};

export const updateCollege = (id, collegeData) => {
  const colleges = getColleges();
  const updated = colleges.map((col) =>
    col.id === id ? { ...col, ...collegeData, totalSeatLimit: Number(collegeData.totalSeatLimit) || col.totalSeatLimit } : col
  );
  saveColleges(updated);
  return updated;
};

export const deleteCollege = (id) => {
  const colleges = getColleges();
  const updated = colleges.filter((col) => col.id !== id);
  saveColleges(updated);
  return updated;
};
