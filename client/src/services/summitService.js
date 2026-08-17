export const INITIAL_SUMMITS = [
  {
    id: 1,
    duration: "6 Months",
    date: "Starts Oct 2026",
    title: "AI Summit 2026",
    subtitle: "Certificate Program in Generative AI",
    features: [
      "Weekend Classes",
      "No Coding Required",
      "Perfect for Non-Techies",
      "Certificate from NIT"
    ],
    type: "Flagship Event",
    college: "National Institute of Technology"
  },
  {
    id: 2,
    duration: "6 Months",
    date: "Starts Oct 2026",
    title: "AI Summit 2026",
    subtitle: "Certificate Program in Generative AI",
    features: [
      "Weekend Classes",
      "No Coding Required",
      "Perfect for Non-Techies",
      "Certificate from IIT"
    ],
    type: "Flagship Event",
    college: "Indian Institute of Technology"
  },
  {
    id: 3,
    duration: "6 Months",
    date: "Starts Oct 2026",
    title: "AI Summit 2026",
    subtitle: "Certificate Program in Generative AI",
    features: [
      "Weekend Classes",
      "No Coding Required",
      "Perfect for Non-Techies",
      "Certificate from DTU"
    ],
    type: "Flagship Event",
    college: "Delhi Technological University"
  }
];

export const getSummits = () => {
  const summits = localStorage.getItem('vmanous_summits');
  if (!summits) {
    localStorage.setItem('vmanous_summits', JSON.stringify(INITIAL_SUMMITS));
    return INITIAL_SUMMITS;
  }
  return JSON.parse(summits);
};

export const saveSummits = (summits) => {
  localStorage.setItem('vmanous_summits', JSON.stringify(summits));
};

export const addSummit = (summit) => {
  const summits = getSummits();
  const newSummit = { ...summit, id: Date.now() };
  summits.push(newSummit);
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
