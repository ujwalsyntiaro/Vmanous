// Partner Colleges & Campus Seat Management Service

const INITIAL_COLLEGES = [
  {
    id: "col_101",
    name: "G H Raisoni College of Engineering",
    shortCode: "GHRCEM",
    city: "Nagpur",
    state: "Maharashtra",
    address: "Hingna Road, Digdoh Hills, Nagpur - 440016",
    mouStatus: "Active MOU",
    mouSignedDate: "2026-01-15",
    contactPerson: "Dr. Rajesh Kumar",
    contactEmail: "rajesh.kumar@ghrcem.raisoni.net",
    contactPhone: "+91 9876543210",
    totalSeatLimit: 100,
  },
  {
    id: "col_102",
    name: "National Institute of Technology",
    shortCode: "NITT",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    address: "Tanjore Main Road, National Highway 67, Tiruchirappalli",
    mouStatus: "Active MOU",
    mouSignedDate: "2025-11-20",
    contactPerson: "Prof. S. Venkatesh",
    contactEmail: "venkatesh@nitt.edu",
    contactPhone: "+91 9823456789",
    totalSeatLimit: 100,
  },
  {
    id: "col_103",
    name: "Indian Institute of Technology Bombay",
    shortCode: "IITB",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Main Gate Rd, IIT Area, Powai, Mumbai - 400076",
    mouStatus: "Active MOU",
    mouSignedDate: "2026-02-01",
    contactPerson: "Dr. Anita Joshi",
    contactEmail: "anita.joshi@iitb.ac.in",
    contactPhone: "+91 9988776655",
    totalSeatLimit: 150,
  },
  {
    id: "col_104",
    name: "College of Engineering Pune",
    shortCode: "COEP",
    city: "Pune",
    state: "Maharashtra",
    address: "Wellesley Rd, Shivajinagar, Pune - 411005",
    mouStatus: "In Discussion",
    mouSignedDate: "2026-03-10",
    contactPerson: "Prof. Milind Patil",
    contactEmail: "milind.patil@coep.ac.in",
    contactPhone: "+91 9765432100",
    totalSeatLimit: 100,
  },
  {
    id: "col_105",
    name: "D Y Patil College of Engineering",
    shortCode: "DYPCOE",
    city: "Pune",
    state: "Maharashtra",
    address: "Akurdi, Sector 29, Nigdi Pradhikaran, Pune - 411044",
    mouStatus: "Active MOU",
    mouSignedDate: "2026-01-10",
    contactPerson: "Dr. S. P. Patil",
    contactEmail: "sp.patil@dypcoe.edu.in",
    contactPhone: "+91 9890123456",
    totalSeatLimit: 200,
  },
];

export const getColleges = () => {
  const stored = localStorage.getItem("vmanous_colleges");
  if (stored) {
    const parsed = JSON.parse(stored);
    // Ensure initial colleges like D Y Patil are merged if missing in older cache
    const existingNames = new Set(parsed.map((c) => c.name));
    let hasNew = false;
    INITIAL_COLLEGES.forEach((initCol) => {
      if (!existingNames.has(initCol.name)) {
        parsed.push(initCol);
        hasNew = true;
      }
    });
    if (hasNew) {
      localStorage.setItem("vmanous_colleges", JSON.stringify(parsed));
    }
    return parsed;
  }
  localStorage.setItem("vmanous_colleges", JSON.stringify(INITIAL_COLLEGES));
  return INITIAL_COLLEGES;
};

export const saveColleges = (colleges) => {
  localStorage.setItem("vmanous_colleges", JSON.stringify(colleges));
};

export const addCollege = (collegeData) => {
  const colleges = getColleges();
  const newCollege = {
    id: `col_${Date.now()}`,
    totalSeatLimit: Number(collegeData.totalSeatLimit) || 100,
    mouStatus: collegeData.mouStatus || "Active MOU",
    ...collegeData,
  };
  const updated = [newCollege, ...colleges];
  saveColleges(updated);

  // Sync with MySQL Database
  try {
    fetch("/api/v1/colleges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCollege),
    }).catch((err) => console.log("College API sync notice:", err));
  } catch (err) {
    console.error("College API error:", err);
  }

  return newCollege;
};

export const updateCollege = (id, collegeData) => {
  const colleges = getColleges();
  const updated = colleges.map((col) =>
    col.id === id
      ? {
          ...col,
          ...collegeData,
          totalSeatLimit:
            Number(collegeData.totalSeatLimit) || col.totalSeatLimit,
        }
      : col,
  );
  saveColleges(updated);

  // Sync with MySQL Database
  try {
    fetch(`/api/v1/colleges/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collegeData),
    }).catch((err) => console.log("College PUT notice:", err));
  } catch (err) {
    console.error("College update error:", err);
  }

  return updated;
};

export const deleteCollege = (id) => {
  const colleges = getColleges();
  const updated = colleges.filter((col) => col.id !== id);
  saveColleges(updated);

  // Sync with MySQL Database
  try {
    fetch(`/api/v1/colleges/${id}`, {
      method: "DELETE",
    }).catch((err) => console.log("College DELETE notice:", err));
  } catch (err) {
    console.error("College delete error:", err);
  }

  return updated;
};
