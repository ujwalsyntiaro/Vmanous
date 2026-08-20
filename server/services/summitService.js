export const INITIAL_SUMMITS = [
  {
    id: 1,
    duration: "2-Day Live Workshop",
    time: "10:00 AM - 4:00 PM (10 Hrs)",
    date: "Oct 24-25, 2026",
    address: "Main Auditorium, NIT Campus",
    status: "Registration Open",
    price: 1999,
    originalPrice: 4999,
    taxRate: 18,
    taxMode: "Exclusive",
    processingFee: 0,
    processingFeeType: "Fixed",
    title: "AI Summit Workshop 2026",
    subtitle: "Generative AI, Prompt Engineering & Agentic LLMs",
    features: [],
    type: "Flagship Event",
    college: "National Institute of Technology"
  },
  {
    id: 2,
    duration: "3-Day Hands-on Summit",
    time: "09:00 AM - 5:00 PM",
    date: "Nov 14-16, 2026",
    address: "Research Complex, IIT Campus",
    status: "Upcoming",
    price: 2999,
    originalPrice: 6999,
    taxRate: 18,
    taxMode: "Exclusive",
    processingFee: 0,
    processingFeeType: "Fixed",
    title: "AI Summit Workshop 2026",
    subtitle: "Machine Learning, PyTorch & Deep Learning Models",
    features: [],
    type: "Flagship Event",
    college: "Indian Institute of Technology"
  },
  {
    id: 3,
    duration: "2-Day National Bootcamp",
    time: "10:00 AM - 4:00 PM (10 Hrs)",
    date: "Dec 12-13, 2026",
    address: "Seminar Hall, DTU Delhi",
    status: "Registration Open",
    price: 1999,
    originalPrice: 4999,
    taxRate: 18,
    taxMode: "Exclusive",
    processingFee: 0,
    processingFeeType: "Fixed",
    title: "AI Summit Workshop 2026",
    subtitle: "Full-Stack AI & RAG Architecture Engineering",
    features: [],
    type: "Flagship Event",
    college: "Delhi Technological University"
  }
];

export const getSummits = () => {
  const stored = localStorage.getItem('vmanous_summits');
  if (stored) {
    const parsed = JSON.parse(stored);
    const updated = parsed.map((s) => {
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
        price: s.price !== undefined ? s.price : 1999,
        originalPrice: s.originalPrice || 4999,
        taxRate: s.taxRate !== undefined ? s.taxRate : 18,
        taxMode: s.taxMode || 'Exclusive',
        processingFee: s.processingFee || 0,
        processingFeeType: s.processingFeeType || 'Fixed',
        features: s.features || []
      };
    });
    localStorage.setItem('vmanous_summits', JSON.stringify(updated));
    return updated;
  }
  localStorage.setItem('vmanous_summits', JSON.stringify(INITIAL_SUMMITS));
  return INITIAL_SUMMITS;
};

export const saveSummits = (summits) => {
  localStorage.setItem('vmanous_summits', JSON.stringify(summits));
};

export const addSummit = (summit) => {
  const summits = getSummits();
  const newSummit = { ...summit, id: Date.now() };
  summits.unshift(newSummit);
  saveSummits(summits);
  return newSummit;
};

export const updateSummit = (id, updatedSummit) => {
  const summits = getSummits();
  const index = summits.findIndex(s => s.id === id);
  if (index !== -1) {
    summits[index] = { ...updatedSummit, id };
    saveSummits(summits);
    return true;
  }
  return false;
};

export const deleteSummit = (id) => {
  const summits = getSummits();
  const newSummits = summits.filter(s => s.id !== id);
  saveSummits(newSummits);
};
