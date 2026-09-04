// Enrolled Students Roster & Digital Pass Service
import { fetchApplicationsAsync } from "./applicationService";

export const getUniqueStudents = (applicationsList = [], dbStudentsList = []) => {
  const map = new Map();

  const processItem = (item, isDb = false) => {
    if (!item) return;
    if (item.paymentStatus && item.paymentStatus === "Failed") return;
    const name = (item.studentName || item.name || "").trim();
    const email = (item.email || "").trim().toLowerCase();
    const phone = (item.phone || "").trim();
    const passCode = (item.passCode || "").trim();

    if (!name && !email && !phone) return;

    // Deduplicate by Pass Code or Email so each enrolled student gets 1 clean roster entry
    const key = passCode
      ? `pass_${passCode}`
      : (email ? `email_${email}` : `phone_${phone}`);

    if (!map.has(key)) {
      map.set(key, {
        id: item.id ? (isDb ? `stu_${item.id}` : item.id) : `stu_${Date.now()}`,
        dbId: isDb ? item.id : null,
        studentName: name || "Student",
        email: email || item.email || "",
        phone: item.phone || item.mobileNumber || "",
        bloodGroup: item.bloodGroup || "O+",
        collegeName: item.collegeName || "Partner College",
        programTitle: item.programTitle || "AI SUMMIT WORKSHOP 2030",
        venueLocation: item.venueLocation || "Main Campus",
        branch: item.branch || "Computer Science & Engineering",
        year: item.year || item.semester || "3rd Year",
        degree: item.degree || "B.Tech",
        selfiePhotoUrl: item.selfiePhotoUrl || item.selfie || "",
        marksTenth: item.marksTenth || "",
        marksTwelfth: item.marksTwelfth || "",
        passCode: item.passCode || "PASS-VERIFIED",
        transactionId: item.transactionId || "",
        paymentStatus: item.paymentStatus || "Paid",
        amountPaid: item.amountPaid !== undefined && item.amountPaid !== null ? Number(item.amountPaid) : 0,
        baseAmount: item.baseAmount !== undefined && item.baseAmount !== null ? Number(item.baseAmount) : null,
        gstAmount: item.gstAmount !== undefined && item.gstAmount !== null ? Number(item.gstAmount) : null,
        platformFee: item.platformFee !== undefined && item.platformFee !== null ? Number(item.platformFee) : 0,
        summitId: item.summitId || null,
        attendance: item.attendance || { day1: false, day2: false },
        createdAt: item.createdAt || new Date().toISOString(),
        enrolledAt: item.createdAt || new Date().toISOString(),
      });
    } else {
      // Merge details into existing record
      const existing = map.get(key);
      map.set(key, {
        ...existing,
        studentName: name || existing.studentName,
        phone: phone || existing.phone,
        collegeName: item.collegeName || existing.collegeName,
        programTitle: item.programTitle || existing.programTitle,
        venueLocation: item.venueLocation || existing.venueLocation,
        branch: item.branch || existing.branch,
        year: item.year || existing.year,
        degree: item.degree || existing.degree,
        selfiePhotoUrl: item.selfiePhotoUrl || existing.selfiePhotoUrl,
        marksTenth: item.marksTenth || existing.marksTenth,
        marksTwelfth: item.marksTwelfth || existing.marksTwelfth,
        passCode: passCode || existing.passCode,
        transactionId: item.transactionId || existing.transactionId,
        amountPaid: item.amountPaid !== undefined && item.amountPaid !== null ? Number(item.amountPaid) : existing.amountPaid,
        baseAmount: item.baseAmount !== undefined && item.baseAmount !== null ? Number(item.baseAmount) : existing.baseAmount,
        gstAmount: item.gstAmount !== undefined && item.gstAmount !== null ? Number(item.gstAmount) : existing.gstAmount,
        platformFee: item.platformFee !== undefined && item.platformFee !== null ? Number(item.platformFee) : existing.platformFee,
        summitId: item.summitId || existing.summitId,
      });
    }
  };

  if (Array.isArray(applicationsList)) {
    applicationsList.forEach(app => processItem(app, false));
  }
  if (Array.isArray(dbStudentsList)) {
    dbStudentsList.forEach(s => processItem(s, true));
  }

  return Array.from(map.values());
};

let _inMemoryStudents = [];

export const getStudents = () => {
  return _inMemoryStudents;
};

export const saveStudents = (students) => {
  if (Array.isArray(students)) {
    _inMemoryStudents = students;
  }
};

export const fetchStudentsAsync = async () => {
  try {
    const [appsResult, stuRes] = await Promise.all([
      fetchApplicationsAsync(),
      fetch(`/api/v1/students?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }).then(r => r.ok ? r.json() : { success: false, data: [] })
    ]);

    const apps = appsResult.applications || [];
    const dbStudents = (stuRes && stuRes.success && Array.isArray(stuRes.data)) ? stuRes.data : [];
    const unique = getUniqueStudents(apps, dbStudents);
    _inMemoryStudents = unique;
    return unique;
  } catch (err) {
    console.error("Error fetching students async:", err);
    return _inMemoryStudents;
  }
};

export const addStudent = async (studentData) => {
  try {
    const res = await fetch("/api/v1/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: studentData.studentName || studentData.name,
        email: studentData.email,
        phone: studentData.phone || "",
        collegeName: studentData.collegeName || "Partner Institution",
        branch: studentData.branch,
        year: studentData.year,
        passCode: studentData.passCode,
      }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Student API error:", err);
    return { success: false, error: err.message };
  }
};

export const updateStudentAttendance = async (id, day, isPresent) => {
  const numId = String(id).startsWith("stu_") ? id.replace("stu_", "") : id;
  try {
    const res = await fetch(`/api/v1/students/${numId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceDay: day, isPresent }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Student update attendance error:", err);
  }
};

export const deleteStudent = async (id) => {
  const numId = String(id).startsWith("stu_") ? id.replace("stu_", "") : id;
  try {
    const res = await fetch(`/api/v1/students/${numId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Student delete error:", err);
  }
};
