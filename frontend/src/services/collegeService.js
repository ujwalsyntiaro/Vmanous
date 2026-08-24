// Partner Colleges & Campus Seat Management Service

const INITIAL_COLLEGES = [];

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
