import { getApplications } from './applicationService';

export const formatEventDates = (startDate, endDate) => {
  if (!startDate && !endDate) return '';
  if (!endDate) return startDate;
  if (!startDate) return endDate;

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
    const m1 = d1.toLocaleString('en-US', { month: 'short' });
    const m2 = d2.toLocaleString('en-US', { month: 'short' });
    const day1 = d1.getDate();
    const day2 = d2.getDate();
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();

    if (m1 === m2 && year1 === year2) {
      return `${m1} ${day1}-${day2}, ${year1}`;
    } else if (year1 === year2) {
      return `${m1} ${day1} - ${m2} ${day2}, ${year1}`;
    } else {
      return `${m1} ${day1}, ${year1} - ${m2} ${day2}, ${year2}`;
    }
  }

  return `${startDate} - ${endDate}`;
};

export const INITIAL_SUMMITS = [
  {
    id: 1,
    title: 'AI SUMMIT WORKSHOP',
    subtitle: 'Generative AI, Prompt Engineering & Agentic LLMs',
    type: 'Flagship Event',
    college: 'G H RAISONI',
    address: 'Shradhhaa park Nagpur',
    price: 1999,
    originalPrice: 4999,
    taxRate: 18,
    taxMode: 'Exclusive',
    processingFee: 0,
    processingFeeType: 'Fixed',
    duration: '1-Day Live Workshop',
    time: '10:00 AM - 05:00 PM',
    startDate: '2026-08-19',
    endDate: '2026-08-19',
    date: '19-08-2026',
    seatCapacity: 100,
    status: 'Registration Open',
    features: ['Providing Certificate']
  },
  {
    id: 2,
    title: 'Workshop Aegentic ai',
    subtitle: 'Full-Stack AI & RAG Architecture Engineering',
    type: 'Campus Workshop',
    college: 'KDK',
    address: 'Sakardhara',
    price: 2999,
    originalPrice: 6999,
    taxRate: 18,
    taxMode: 'Exclusive',
    processingFee: 0,
    processingFeeType: 'Fixed',
    duration: '2-Day Live Workshop',
    time: '10:00 AM - 05:00 PM',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    date: '20-08-2026',
    seatCapacity: 10,
    status: 'Filling Fast',
    features: ['Expert Mentorship']
  },
  {
    id: 3,
    title: 'Data Science',
    subtitle: 'Machine Learning, PyTorch & Deep Learning Models',
    type: 'Flagship Event',
    college: 'D Y PATIL',
    address: 'Akurdi pune',
    price: 1999,
    originalPrice: 4999,
    taxRate: 18,
    taxMode: 'Exclusive',
    processingFee: 0,
    processingFeeType: 'Fixed',
    duration: '2-Day Live Workshop',
    time: '10:00 AM - 05:00 PM',
    startDate: '2026-08-20',
    endDate: '2026-08-25',
    date: 'Aug 20-25, 2026',
    seatCapacity: 150,
    status: 'Registration Open',
    features: ['Providing Certificate', '123456']
  },
  {
    id: 4,
    title: 'AI Summit Workshop 2026',
    subtitle: 'Machine Learning, PyTorch & Deep Learning Models',
    type: 'Flagship Event',
    college: 'INDIAN INSTITUTE OF TECHNOLOGY',
    address: 'Victor Menezes Convention Centre',
    price: 2999,
    originalPrice: 6999,
    taxRate: 18,
    taxMode: 'Exclusive',
    processingFee: 0,
    processingFeeType: 'Fixed',
    duration: '3-Day Hands-on Summit',
    time: '09:00 AM - 05:00 PM',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    date: 'Nov 14-16, 2026',
    seatCapacity: 100,
    status: 'Registration Open',
    features: ['Hands-on GPU Labs']
  },
  {
    id: 5,
    title: 'AI Summit Workshop 2026',
    subtitle: 'Full-Stack AI & RAG Architecture Engineering',
    type: 'Flagship Event',
    college: 'DELHI TECHNOLOGICAL UNIVERSITY',
    address: 'Delhi Campus Auditorium',
    price: 1999,
    originalPrice: 4999,
    taxRate: 18,
    taxMode: 'Exclusive',
    processingFee: 0,
    processingFeeType: 'Fixed',
    duration: '2-Day National Bootcamp',
    time: '10:00 AM - 04:00 PM',
    startDate: '2026-12-12',
    endDate: '2026-12-13',
    date: 'Dec 12-13, 2026',
    seatCapacity: 100,
    status: 'Registration Open',
    features: ['Full Stack AI']
  }
];

const isCollegeMatch = (colA, colB) => {
  if (!colA || !colB) return false;
  const a = colA.trim().toLowerCase();
  const b = colB.trim().toLowerCase();

  if (a === b || a.includes(b) || b.includes(a)) return true;

  const keywordsMap = [
    { keys: ['nit', 'national institute of technology'] },
    { keys: ['iit', 'indian institute of technology'] },
    { keys: ['dtu', 'delhi technological university'] },
    { keys: ['d y patil', 'd.y. patil', 'dypatil', 'dyp'] },
    { keys: ['raisoni', 'ghraisoni', 'ghrcem'] },
    { keys: ['kdk'] }
  ];

  for (const group of keywordsMap) {
    const hasA = group.keys.some(k => a.includes(k));
    const hasB = group.keys.some(k => b.includes(k));
    if (hasA && hasB) return true;
  }

  const wordsA = a.split(/\s+/).filter(w => w.length >= 4 && !['college', 'engineering', 'institute', 'technology', 'university'].includes(w));
  const wordsB = b.split(/\s+/).filter(w => w.length >= 4 && !['college', 'engineering', 'institute', 'technology', 'university'].includes(w));

  return wordsA.some(w => wordsB.includes(w));
};

export const getSummits = () => {
  let paidApps = [];
  try {
    const apps = getApplications();
    paidApps = apps.filter(a => a.paymentStatus === 'Paid');
  } catch (e) {
    console.error('Error fetching applications for summit count:', e);
  }

  const computeCount = (s) => {
    const sumTitle = (s.title || '').trim().toLowerCase();

    const matched = paidApps.filter(a => {
      // 1. Exclude non-paid applications
      if (a.paymentStatus && a.paymentStatus !== 'Paid') return false;

      // 2. Validate college match
      const collegeMatches = isCollegeMatch(a.collegeName, s.college);

      // 3. If summitId matches AND college matches, count it
      if (a.summitId && (a.summitId === s.id || Number(a.summitId) === Number(s.id))) {
        if (!s.college || collegeMatches) {
          return true;
        }
      }

      // 4. Otherwise, BOTH program title AND college must match
      const progTitle = (a.programTitle || '').trim().toLowerCase();
      const titleMatches = Boolean(progTitle && sumTitle && (progTitle === sumTitle || progTitle.includes(sumTitle) || sumTitle.includes(progTitle)));

      return titleMatches && collegeMatches;
    });

    return matched.length;
  };

  const stored = localStorage.getItem('vmanous_summits');
  let listToProcess = INITIAL_SUMMITS;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= INITIAL_SUMMITS.length) {
        listToProcess = parsed;
      } else if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing summits from INITIAL_SUMMITS
        const existingIds = new Set(parsed.map(p => Number(p.id)));
        const missing = INITIAL_SUMMITS.filter(init => !existingIds.has(Number(init.id)));
        listToProcess = [...parsed, ...missing];
      }
    } catch (e) {
      console.error('Error parsing stored summits:', e);
    }
  }

  const updated = listToProcess.map((s) => {
    let dur = s.duration;
    if (!dur || dur === '1' || dur === '2' || !isNaN(dur)) {
      const num = parseInt(dur) || 2;
      dur = `${num}-Day Live Workshop`;
    }
    return {
      ...s,
      duration: dur,
      address: s.address || '',
      time: s.time || '',
      status: s.status || 'Registration Open',
      seatCapacity: s.seatCapacity !== undefined ? s.seatCapacity : 100,
      enrolledCount: (s.enrolledCount !== undefined && s.enrolledCount !== null && s.enrolledCount > 0) ? s.enrolledCount : (computeCount(s) || s.enrolledCount || 0),
      price: s.price !== undefined ? s.price : 1999,
      originalPrice: s.originalPrice || 4999,
      taxRate: s.taxRate !== undefined ? s.taxRate : 18,
      taxMode: s.taxMode || 'Exclusive',
      processingFee: s.processingFee || 0,
      processingFeeType: s.processingFeeType || 'Fixed',
      startDate: s.startDate || '',
      endDate: s.endDate || '',
      features: s.features || []
    };
  });

  localStorage.setItem('vmanous_summits', JSON.stringify(updated));
  return updated;
};

export const isSummitActive = (summit) => {
  if (!summit) return false;

  // 1. Seats Full Validation
  const enrolledCount = (summit.enrolledCount !== undefined && summit.enrolledCount !== null)
    ? Number(summit.enrolledCount)
    : (Array.isArray(summit.applications)
      ? summit.applications.filter(a => a.paymentStatus === 'Paid' || !a.paymentStatus).length
      : 0);
  const seatCapacity = summit.seatCapacity !== undefined ? Number(summit.seatCapacity) : 100;

  if (seatCapacity > 0 && enrolledCount >= seatCapacity) {
    return false; // Seats are full -> hide
  }

  // 2. Date Completed / Expired Validation
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const parseDateStr = (dStr) => {
    if (!dStr) return null;
    const str = String(dStr).trim();

    // DD-MM-YYYY or DD/MM/YYYY (e.g. 19-08-2026)
    if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(str)) {
      const parts = str.split(/[-\/]/).map(Number);
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    // YYYY-MM-DD (e.g. 2026-08-19)
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    // Range e.g. "Aug 20-25, 2026" or "Aug 20 - 25, 2026"
    const rangeMatch = str.match(/([A-Za-z]+)\s+\d+(?:\s*-\s*(\d+))?,\s*(\d{4})/);
    if (rangeMatch) {
      const month = rangeMatch[1];
      const endDay = rangeMatch[2] || '28';
      const year = rangeMatch[3];
      const parsedRange = new Date(`${month} ${endDay}, ${year}`);
      if (!isNaN(parsedRange.getTime())) return parsedRange;
    }

    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) return parsed;

    return null;
  };

  const eventDate = parseDateStr(summit.endDate) || parseDateStr(summit.date) || parseDateStr(summit.startDate);

  if (eventDate) {
    eventDate.setHours(23, 59, 59, 999);
    if (eventDate < now) {
      return false; // Event date completed -> hide
    }
  }

  return true;
};

export const getActiveSummits = () => {
  const summits = getSummits();
  return summits.filter(isSummitActive);
};

export const saveSummits = (summits) => {
  localStorage.setItem('vmanous_summits', JSON.stringify(summits));
};

export const fetchSummitsAsync = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/v1/summits');
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      saveSummits(data.data);
      return getSummits();
    }
  } catch (err) {
    console.warn('API fetch summits failed, fallback to local:', err);
  }
  return getSummits();
};

export const addSummit = (summit) => {
  const summits = getSummits();
  const newSummit = { ...summit, id: Date.now() };
  summits.unshift(newSummit);
  saveSummits(summits);

  // Sync with MySQL Database
  try {
    fetch('http://localhost:5000/api/v1/summits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSummit)
    }).catch(err => console.log('Summit API sync notice:', err));
  } catch (err) {
    console.error('Summit API error:', err);
  }

  return newSummit;
};

export const updateSummit = (id, updatedSummit) => {
  const summits = getSummits();
  const index = summits.findIndex(s => s.id === id);
  if (index !== -1) {
    summits[index] = { ...updatedSummit, id };
    saveSummits(summits);

    // Sync with MySQL Database
    try {
      fetch(`http://localhost:5000/api/v1/summits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSummit)
      }).catch(err => console.log('Summit PUT notice:', err));
    } catch (err) {
      console.error('Summit update error:', err);
    }

    return true;
  }
  return false;
};

export const deleteSummit = (id) => {
  const summits = getSummits();
  const newSummits = summits.filter(s => s.id !== id);
  saveSummits(newSummits);

  // Sync with MySQL Database
  try {
    fetch(`http://localhost:5000/api/v1/summits/${id}`, {
      method: 'DELETE'
    }).catch(err => console.log('Summit DELETE notice:', err));
  } catch (err) {
    console.error('Summit delete error:', err);
  }
};
