// Enrolled Students Roster & Digital Pass Service
import { getApplications } from "./applicationService";

if (typeof window !== "undefined") {
  localStorage.removeItem("vmanous_students");
  localStorage.removeItem("vmanous_custom_students");
}

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

export const getStudents = () => {
  const apps = getApplications();
  const stored = localStorage.getItem("vmanous_custom_students");
  const customList = stored ? JSON.parse(stored) : [];
  return getUniqueStudents(apps, customList);
};

export const saveStudents = (students) => {
  localStorage.setItem("vmanous_custom_students", JSON.stringify(students));
};

export const addStudent = (studentData) => {
  const students = getStudents();
  const newStudent = {
    id: `stu_${Date.now()}`,
    enrolledAt: new Date().toISOString(),
    paymentStatus: "Paid",
    attendance: { day1: false, day2: false },
    ...studentData,
  };
  const updated = [newStudent, ...students];
  saveStudents(updated);

  // Sync with MySQL Database
  try {
    fetch("/api/v1/students", {
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
    }).catch((err) => console.log("Student API sync notice:", err));
  } catch (err) {
    console.error("Student API error:", err);
  }

  return newStudent;
};

export const updateStudentAttendance = (id, day, isPresent) => {
  const students = getStudents();
  const updated = students.map((s) => {
    if (s.id === id) {
      const currentAttendance = s.attendance || { day1: false, day2: false };
      return {
        ...s,
        attendance: {
          ...currentAttendance,
          [day]: isPresent,
        },
      };
    }
    return s;
  });
  saveStudents(updated);

  // Sync with MySQL Database
  try {
    fetch(`/api/v1/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendanceDay: day, isPresent }),
    }).catch((err) => console.log("Student PUT notice:", err));
  } catch (err) {
    console.error("Student update error:", err);
  }

  return updated;
};

export const deleteStudent = (id) => {
  const students = getStudents();
  const updated = students.filter((s) => s.id !== id);
  saveStudents(updated);

  // Sync with MySQL Database
  try {
    fetch(`/api/v1/students/${id}`, {
      method: "DELETE",
    }).catch((err) => console.log("Student DELETE notice:", err));
  } catch (err) {
    console.error("Student delete error:", err);
  }

  return updated;
};
