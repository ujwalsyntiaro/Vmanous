import { getAuthHeaders } from "./adminAuthService";

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
  if (a.includes(b) || b.includes(a)) return true;

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

  const genericWords = [
    "college", "engineering", "institute", "technology", "university",
    "campus", "auditorium", "main"
  ];

  const wordsA = a.split(/[\s,.-]+/).filter((w) => w.length >= 3 && !genericWords.includes(w));
  const wordsB = b.split(/[\s,.-]+/).filter((w) => w.length >= 3 && !genericWords.includes(w));

  if (wordsA.length === 0 || wordsB.length === 0) return false;

  return wordsA.some((w) => wordsB.includes(w) || wordsB.some((wb) => wb.includes(w) || w.includes(wb)));
};

let _inMemorySummits = [];

export const formatSummit = (s) => {
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
    const dMatch = String(dur).match(/(\d+)\s*[- ]*day/i);
    if (dMatch) {
      dur = `${dMatch[1]}-Day Live Workshop`;
    }
  }

  const enrolled = (s.enrolledCount !== undefined && s.enrolledCount !== null && !isNaN(Number(s.enrolledCount)))
    ? Number(s.enrolledCount)
    : (Array.isArray(s.applications) ? s.applications.filter(a => a.paymentStatus === 'Paid' || !a.paymentStatus).length : 0);

  const cap = s.seatCapacity !== undefined && s.seatCapacity !== null ? Number(s.seatCapacity) : 100;
  const isCompleted = s.status === 'Event Completed' || s.status === 'Completed';
  const isFull = enrolled >= cap;
  const isClosed = s.status === 'Closed' || s.status === 'Registration Closed' || isFull;
  const dynamicStatus = isCompleted
    ? s.status
    : (isClosed ? 'Registration Closed' : (enrolled >= cap * 0.8 ? 'Filling Fast' : (s.status === 'Filling Fast' ? 'Filling Fast' : 'Registration Open')));

  return {
    ...s,
    duration: dur,
    totalHours: totalHours,
    address: s.address || "",
    time: s.time || "",
    status: dynamicStatus,
    seatCapacity: cap,
    enrolledCount: enrolled,
    price: s.price !== undefined ? Number(s.price) : 1999,
    originalPrice: s.originalPrice ? Number(s.originalPrice) : 4999,
    taxRate: s.taxRate !== undefined ? Number(s.taxRate) : 18,
    taxMode: s.taxMode || "Exclusive",
    processingFee: (s.processingFee !== undefined && s.processingFee !== null) ? Number(s.processingFee) : 0,
    processingFeeType: s.processingFeeType || 'Percentage',
    startDate: s.startDate || "",
    endDate: s.endDate || "",
    features: Array.isArray(s.features) ? s.features : (typeof s.features === 'string' ? s.features.split('\n').filter(Boolean) : []),
  };
};

export const getSummits = () => {
  return _inMemorySummits.map(formatSummit);
};

export const parseSummitDate = (dStr) => {
  if (!dStr) return null;
  const str = String(dStr).trim();

  // YYYY-MM-DD (e.g. 2026-08-30)
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  // DD-MM-YYYY or DD/MM/YYYY (e.g. 05/09/2026, 19-08-2026, 30-08-2026)
  if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(str)) {
    const parts = str.split(/[-\/]/).map(Number);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  // Range e.g. "Aug 20-25, 2026" or "Aug 20 - 25, 2026" or "Aug 24, 2026"
  const rangeMatch = str.match(
    /([A-Za-z]+)\s+(\d+)(?:\s*-\s*(\d+))?,\s*(\d{4})/,
  );
  if (rangeMatch) {
    const month = rangeMatch[1];
    const startDay = rangeMatch[2];
    const endDay = rangeMatch[3] || startDay;
    const year = rangeMatch[4];
    const parsedRange = new Date(`${month} ${endDay}, ${year}`);
    if (!isNaN(parsedRange.getTime())) return parsedRange;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed;

  return null;
};

export const isRegistrationUpcoming = (summit) => {
  if (!summit || !summit.startDate) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const startD = parseSummitDate(summit.startDate);
  if (!startD) return false;

  startD.setHours(0, 0, 0, 0);
  return now < startD;
};

export const isSummitActive = (summit) => {
  if (!summit) return false;

  // 1. Explicit status check: if marked completed, return false
  if (summit.status === 'Event Completed' || summit.status === 'Completed') {
    return false;
  }

  // 2. Date Completed / Expired Validation (Must happen before blindly trusting text status)
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today

  const eventDate = parseSummitDate(summit.endDate) || parseSummitDate(summit.startDate) || parseSummitDate(summit.date);

  if (eventDate) {
    eventDate.setHours(23, 59, 59, 999);
    if (eventDate < now) {
      return false; // Event date is strictly in the past -> move to Past Records / Inactive
    }
  }

  // 3. If date validation passes (event is in future/today), check text status
  if (!summit.status || summit.status === 'Registration Open' || summit.status === 'Filling Fast' || summit.status === 'Registration Closed') {
    return true;
  }

  return true;
};

export const isSummitVisiblePublicly = (summit) => {
  if (!summit) return false;

  // 1. First check if summit is active (not past/completed)
  if (!isSummitActive(summit)) {
    return false;
  }

  // 2. Check if registration starting date has arrived
  if (isRegistrationUpcoming(summit)) {
    // Current date is before registration startDate -> do not display on user/public UI
    return false;
  }

  return true;
};

export const getActiveSummits = () => {
  return getSummits().filter(isSummitActive);
};

export const getPublicSummits = () => {
  return getSummits().filter(isSummitVisiblePublicly);
};

export const saveSummits = (summits) => {
  if (Array.isArray(summits)) {
    _inMemorySummits = summits;
  }
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
        _inMemorySummits = data.data;
        return _inMemorySummits.map(formatSummit);
      }
    }
  } catch (err) {
    console.warn("API fetch summits failed:", err);
  }
  return _inMemorySummits.map(formatSummit);
};

export const addSummit = async (summit) => {
  const normalizedCode = summit.entryCode ? String(summit.entryCode).trim().toUpperCase() : null;
  const summitData = { ...summit, entryCode: normalizedCode };

  // Sync with MySQL Database
  try {
    const res = await fetch("/api/v1/summits", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(summitData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to create workshop" };
    }

    const createdSummit = data.data;
    _inMemorySummits.unshift(createdSummit);
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
      headers: getAuthHeaders(),
      body: JSON.stringify(summitData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to update workshop" };
    }

    const index = _inMemorySummits.findIndex((s) => s.id === id || Number(s.id) === Number(id));
    if (index !== -1) {
      _inMemorySummits[index] = { ...data.data, id };
    }
    broadcastSummitUpdate();
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

export const deleteSummit = async (id) => {
  _inMemorySummits = _inMemorySummits.filter((s) => s.id !== id && Number(s.id) !== Number(id));
  broadcastSummitUpdate();

  // Sync with MySQL Database
  try {
    const res = await fetch(`/api/v1/summits/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Summit delete error:", err);
  }
};

/**
 * Fetch current authorized webmail for security OTPs
 */
export const getAuthorizedAdminEmail = async () => {
  try {
    const res = await fetch("/api/v1/summits/authorized-email");
    const data = await res.json();
    if (data && data.authorizedEmail) {
      return data.authorizedEmail;
    }
  } catch (err) {
    console.error("Error fetching authorized email:", err);
  }
  return "am@vmanous.com";
};

/**
 * Step 1: Request Email Change -> Sends OTP to current owner
 */
export const requestAuthorizedEmailChange = async (newEmail) => {
  try {
    const res = await fetch("/api/v1/summits/request-email-change", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ newEmail })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error requesting email change:", err);
    return { success: false, error: err.message || "Network error requesting email change" };
  }
};

/**
 * Step 2: Verify OTP from current owner and activate new email
 */
export const verifyAuthorizedEmailChange = async (otp, newEmail) => {
  try {
    const res = await fetch("/api/v1/summits/verify-email-change", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ otp, newEmail })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error verifying email change:", err);
    return { success: false, error: err.message || "Network error verifying OTP" };
  }
};
