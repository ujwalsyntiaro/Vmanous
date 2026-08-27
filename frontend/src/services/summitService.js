import { getApplications } from "./applicationService";

export const liveBroadcastChannel = (typeof window !== "undefined" && "BroadcastChannel" in window)
  ? new BroadcastChannel("vmanous_live_updates")
  : null;

export const broadcastSummitUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("summits_updated"));
    window.dispatchEvent(new Event("applications_updated"));
    if (liveBroadcastChannel) {
      try {
        liveBroadcastChannel.postMessage({ type: "SUMMIT_UPDATED", timestamp: Date.now() });
      } catch (e) { }
    }
  }
};



export const formatEventDates = (startDate, endDate) => {
  if (!startDate && !endDate) return "";
  if (!endDate) endDate = startDate;
  if (!startDate) startDate = endDate;

  const d1 = new Date(startDate);
  const d2 = new Date(endDate);

  if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
    const m1 = d1.toLocaleString("en-US", { month: "short" });
    const m2 = d2.toLocaleString("en-US", { month: "short" });
    const day1 = d1.getDate();
    const day2 = d2.getDate();
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();

    if (m1 === m2 && year1 === year2) {
      if (day1 === day2) {
        return `${m1} ${day1}, ${year1}`;
      }
      return `${m1} ${day1}-${day2}, ${year1}`;
    } else if (year1 === year2) {
      return `${m1} ${day1} - ${m2} ${day2}, ${year1}`;
    } else {
      return `${m1} ${day1}, ${year1} - ${m2} ${day2}, ${year2}`;
    }
  }

  return startDate === endDate ? startDate : `${startDate} - ${endDate}`;
};

export const INITIAL_SUMMITS = [];

export const isCollegeMatch = (colA, colB) => {
  if (!colA || !colB) return false;
  const a = colA.trim().toLowerCase();
  const b = colB.trim().toLowerCase();

  if (a === b) return true;

  const keywordsMap = [
    { keys: ["nit", "national institute of technology"] },
    { keys: ["iit", "indian institute of technology"] },
    { keys: ["dtu", "delhi technological university"] },
    { keys: ["d y patil", "d.y. patil", "dypatil", "dyp"] },
    { keys: ["raisoni", "ghraisoni", "ghrcem"] },
    { keys: ["kdk"] },
    { keys: ["priyadarshini", "priyadhrshini", "pce"] },
    { keys: ["palloti", "pallotti", "st. vincent pallotti", "st vincent pallotti"] },
    { keys: ["ramdeo", "ramdeobaba", "rknec"] }
  ];

  for (const group of keywordsMap) {
    const hasA = group.keys.some((k) => a.includes(k));
    const hasB = group.keys.some((k) => b.includes(k));
    if (hasA && hasB) {
      return true;
    }
  }

  const stopWords = [
    "college", "engineering", "institute", "technology", "university",
    "nagpur", "pune", "delhi", "mumbai", "campus", "nagar", "city",
    "road", "park", "center", "centre", "main", "auditorium", "subhash", "lokmanya", "midc"
  ];

  const wordsA = a.split(/\s+/).filter((w) => w.length >= 3 && !stopWords.includes(w));
  const wordsB = b.split(/\s+/).filter((w) => w.length >= 3 && !stopWords.includes(w));

  if (wordsA.length === 0 || wordsB.length === 0) return false;

  return wordsA.some((w) => wordsB.includes(w));
};

export const getSummits = () => {
  let paidApps = [];
  try {
    const apps = getApplications();
    paidApps = apps.filter((a) => a.paymentStatus === "Paid");
  } catch (e) {
    console.error("Error fetching applications for summit count:", e);
  }

  const computeCount = (s) => {
    const sumTitle = (s.title || "").trim().toLowerCase();

    const matched = paidApps.filter((a) => {
      if (a.paymentStatus && a.paymentStatus !== "Paid") return false;

      // 1. summitId match
      if (
        a.summitId &&
        (a.summitId === s.id || Number(a.summitId) === Number(s.id))
      ) {
        return true;
      }

      // 2. College match
      if (isCollegeMatch(a.collegeName, s.college)) {
        return true;
      }

      // 3. Program Title match
      const progTitle = (a.programTitle || "").trim().toLowerCase();
      if (
        progTitle &&
        sumTitle &&
        (progTitle === sumTitle ||
          progTitle.includes(sumTitle) ||
          sumTitle.includes(progTitle))
      ) {
        return true;
      }

      // 4. Default fallback: Assign unspecified/general applications to Flagship Card 1 (or G H Raisoni)
      if (Number(s.id) === 1 || (s.college && s.college.toUpperCase().includes("RAISONI"))) {
        const matchesOtherCollege = [
          "kdk", "d y patil", "dypatil", "iit", "dtu", "delhi technological"
        ].some(colKey => (a.collegeName || "").toLowerCase().includes(colKey));

        if (!matchesOtherCollege) {
          return true;
        }
      }

      return false;
    });

    return matched.length;
  };

  const stored = localStorage.getItem("vmanous_summits");
  let listToProcess = INITIAL_SUMMITS;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        listToProcess = parsed;
      }
    } catch (e) {
      console.error("Error parsing stored summits:", e);
    }
  }

  if (!Array.isArray(listToProcess) || listToProcess.length === 0) {
    listToProcess = INITIAL_SUMMITS;
  }

  // Partition paid applications across summits without double-counting
  const countsMap = {};
  listToProcess.forEach((s) => {
    countsMap[s.id] = 0;
  });

  const computeCountForSummit = (s) => {
    const sumTitle = (s.title || "").trim().toLowerCase();

    const matched = paidApps.filter((a) => {
      if (a.paymentStatus && a.paymentStatus !== "Paid") return false;

      // 1. Exact summitId match
      if (a.summitId !== null && a.summitId !== undefined && Number(a.summitId) === Number(s.id)) {
        return true;
      }

      // 2. Primary College match (when summit specifies a college)
      if (s.college && isCollegeMatch(a.collegeName, s.college)) {
        return true;
      }

      // 3. Fallback for Flagship Card 1 (G H Raisoni)
      if (Number(s.id) === 1 || (s.college && s.college.toUpperCase().includes("RAISONI"))) {
        const matchesOtherCollege = [
          "kdk", "d y patil", "dypatil", "iit", "dtu", "delhi technological", "priyadarshini", "priyadhrshini", "pce", "palloti"
        ].some(colKey => (a.collegeName || "").toLowerCase().includes(colKey));

        if (!matchesOtherCollege) {
          return true;
        }
      }

      // 4. Fallback exact title match ONLY if summit has no specific college set
      const progTitle = (a.programTitle || "").trim().toLowerCase();
      return Boolean(progTitle && sumTitle && progTitle === sumTitle);
    });

    return matched.length;
  };

  const updated = listToProcess.map((s) => {
    let dur = s.duration || "2-Day Live Workshop";
    let totalHours = (s.totalHours !== undefined && s.totalHours !== null) ? String(s.totalHours).trim() : "";
    if (!totalHours && dur) {
      const hMatch = String(dur).match(/(\d+)\s*(?:hrs|hours)/i);
      if (hMatch) {
        totalHours = hMatch[1];
      }
    }

    if (!dur || dur === "1" || dur === "2" || !isNaN(dur)) {
      const num = parseInt(dur) || 2;
      dur = `${num}-Day Live Workshop`;
    } else if (dur.includes("Live Workshop")) {
      // Normalize duration text
      const dMatch = String(dur).match(/(\d+)\s*[- ]*day/i);
      if (dMatch) {
        dur = `${dMatch[1]}-Day Live Workshop`;
      }
    }

    const computed = computeCountForSummit(s);
    // Prioritize server enrolledCount from database, merging with any local computed count
    const serverEnrolled = (s.enrolledCount !== undefined && s.enrolledCount !== null && !isNaN(Number(s.enrolledCount)))
      ? Number(s.enrolledCount)
      : (Array.isArray(s.applications) ? s.applications.filter(a => a.paymentStatus === 'Paid' || !a.paymentStatus).length : 0);
    const finalEnrolledCount = Math.max(serverEnrolled, computed);

    const cap = s.seatCapacity !== undefined ? Number(s.seatCapacity) : 100;
    const isCompleted = s.status === 'Event Completed' || s.status === 'Completed';
    const isFull = finalEnrolledCount >= cap;
    const isClosed = s.status === 'Closed' || s.status === 'Registration Closed' || isFull;
    const finalStatus = isCompleted
      ? s.status
      : (isClosed ? 'Registration Closed' : (s.status === 'Filling Fast' ? 'Filling Fast' : 'Registration Open'));

    return {
      ...s,
      duration: dur,
      totalHours: totalHours,
      address: s.address || "",
      time: s.time || "",
      status: finalStatus,
      seatCapacity: cap,
      enrolledCount: finalEnrolledCount,
      price: s.price !== undefined ? s.price : 1999,
      originalPrice: s.originalPrice || 4999,
      taxRate: s.taxRate !== undefined ? s.taxRate : 18,
      taxMode: s.taxMode || "Exclusive",
      processingFee: (s.processingFee !== undefined && s.processingFee !== null) ? Number(s.processingFee) : 0,
      processingFeeType: s.processingFeeType || 'Percentage',
      startDate: s.startDate || "",
      endDate: s.endDate || "",
      features: s.features || [],
    };
  });

  localStorage.setItem("vmanous_summits", JSON.stringify(updated));
  return updated;
};

export const isSummitActive = (summit) => {
  if (!summit) return false;

  // 1. Explicit status check: if marked completed, return false
  if (summit.status === 'Event Completed' || summit.status === 'Completed') {
    return false;
  }

  // 2. If status is active (Registration Open, Filling Fast, Registration Closed), return true
  if (!summit.status || summit.status === 'Registration Open' || summit.status === 'Filling Fast' || summit.status === 'Registration Closed') {
    return true;
  }

  // 3. Date Completed / Expired Validation
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  const parseDateStr = (dStr) => {
    if (!dStr) return null;
    const str = String(dStr).trim();

    // YYYY-MM-DD (e.g. 2026-08-30)
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      const [y, m, d] = str.split("-").map(Number);
      return new Date(y, m - 1, d);
    }

    // DD-MM-YYYY or DD/MM/YYYY (e.g. 19-08-2026, 20-08-2026, 30-08-2026)
    if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(str)) {
      const parts = str.split(/[-\/]/).map(Number);
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    // Range e.g. "Aug 20-25, 2026" or "Aug 20 - 25, 2026"
    const rangeMatch = str.match(
      /([A-Za-z]+)\s+\d+(?:\s*-\s*(\d+))?,\s*(\d{4})/,
    );
    if (rangeMatch) {
      const month = rangeMatch[1];
      const endDay = rangeMatch[2] || "28";
      const year = rangeMatch[3];
      const parsedRange = new Date(`${month} ${endDay}, ${year}`);
      if (!isNaN(parsedRange.getTime())) return parsedRange;
    }

    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) return parsed;

    return null;
  };

  const eventDate = parseDateStr(summit.endDate) || parseDateStr(summit.startDate) || parseDateStr(summit.date);

  if (eventDate) {
    eventDate.setHours(23, 59, 59, 999);
    if (eventDate < now) {
      return false; // Event date is in the past -> move to Past Records / Inactive
    }
  }

  return true;
};

export const getActiveSummits = () => {
  const summits = getSummits();
  return summits.filter(isSummitActive);
};

export const saveSummits = (summits) => {
  localStorage.setItem("vmanous_summits", JSON.stringify(summits));
};

export const fetchSummitsAsync = async () => {
  try {
    const res = await fetch(`/api/v1/summits?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        saveSummits(data.data);
        return getSummits();
      }
    }
  } catch (err) {
    console.warn("API fetch summits failed, fallback to local:", err);
  }
  return getSummits();
};

export const addSummit = async (summit) => {
  const normalizedCode = summit.entryCode ? String(summit.entryCode).trim().toUpperCase() : null;
  const summitData = { ...summit, entryCode: normalizedCode };

  // Sync with MySQL Database first for validation
  try {
    const res = await fetch("/api/v1/summits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summitData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to create workshop" };
    }

    const createdSummit = data.data;
    const summits = getSummits();
    summits.unshift(createdSummit);
    saveSummits(summits);
    broadcastSummitUpdate();

    return { success: true, data: createdSummit };
  } catch (err) {
    console.error("Summit API error:", err);
    return { success: false, error: err.message || "Network error creating workshop" };
  }
};

export const updateSummit = async (id, updatedSummit) => {
  const normalizedCode = updatedSummit.entryCode ? String(updatedSummit.entryCode).trim().toUpperCase() : null;
  const summitData = { ...updatedSummit, entryCode: normalizedCode };

  try {
    const res = await fetch(`/api/v1/summits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summitData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to update workshop" };
    }

    const summits = getSummits();
    const index = summits.findIndex((s) => s.id === id || Number(s.id) === Number(id));
    if (index !== -1) {
      summits[index] = { ...data.data, id };
      saveSummits(summits);
      broadcastSummitUpdate();
    }
    return { success: true, data: data.data };
  } catch (err) {
    console.error("Summit update error:", err);
    return { success: false, error: err.message || "Network error updating workshop" };
  }
};

export const verifyEntryCodeAsync = async (summitId, entryCode) => {
  try {
    const res = await fetch("/api/v1/summits/verify-entry-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summitId, entryCode }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Entry code verify error:", err);
    return {
      success: false,
      valid: false,
      error: "Network error verifying entry code. Please try again."
    };
  }
};

export const deleteSummit = (id) => {
  const summits = getSummits();
  const newSummits = summits.filter((s) => s.id !== id);
  saveSummits(newSummits);

  // Sync with MySQL Database
  try {
    fetch(`/api/v1/summits/${id}`, {
      method: "DELETE",
    }).catch((err) => console.log("Summit DELETE notice:", err));
  } catch (err) {
    console.error("Summit delete error:", err);
  }
};
