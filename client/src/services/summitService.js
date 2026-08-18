export const INITIAL_SUMMITS = [
  {
    id: 1,
    duration: "2-Day Live Workshop",
    date: "Oct 24-25, 2026",
    title: "AI Summit Workshop 2026",
    subtitle: "Generative AI, Prompt Engineering & Agentic LLMs",
    features: [],
    type: "Flagship Event",
    college: "National Institute of Technology"
  },
  {
    id: 2,
    duration: "3-Day Hands-on Summit",
    date: "Nov 14-16, 2026",
    title: "AI Summit Workshop 2026",
    subtitle: "Machine Learning, PyTorch & Deep Learning Models",
    features: [],
    type: "Flagship Event",
    college: "Indian Institute of Technology"
  },
  {
    id: 3,
    duration: "2-Day National Bootcamp",
    date: "Dec 12-13, 2026",
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
    return parsed.map((s) => ({
      ...s,
      features: []
    }));
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
