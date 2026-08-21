// Enrolled Students Roster & Digital Pass Service
import { getApplications } from "./applicationService";

if (typeof window !== "undefined") {
  localStorage.removeItem("vmanous_students");
  localStorage.removeItem("vmanous_custom_students");
}

export const getStudents = () => {
  const apps = getApplications();
  const paidApps = apps.filter((a) => a.paymentStatus === "Paid");

  // Format paid applications into roster student profiles
  const appStudents = paidApps.map((app) => ({
    id: app.id,
    studentName: app.studentName,
    email: app.email,
    phone: app.phone,
    collegeName: app.collegeName,
    programTitle: app.programTitle || "AI SUMMIT WORKSHOP 2030",
    venueLocation: app.venueLocation || "Main Auditorium",
    branch: app.branch || "Computer Science & Engineering",
    year: app.year || "3rd Year",
    degree: app.degree || "B.Tech",
    passCode:
      app.passCode ||
      `PASS-${(app.collegeName || "VM").slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    paymentStatus: "Paid",
    attendance: app.attendance || { day1: true, day2: false },
    enrolledAt: app.createdAt || new Date().toISOString(),
  }));

  const stored = localStorage.getItem("vmanous_custom_students");
  const customList = stored ? JSON.parse(stored) : [];

  // Merge paid application students with custom students without duplicate emails
  const merged = [...appStudents];
  customList.forEach((st) => {
    if (
      !merged.some(
        (m) =>
          m.id === st.id ||
          (m.email &&
            st.email &&
            m.email.toLowerCase() === st.email.toLowerCase()),
      )
    ) {
      merged.push(st);
    }
  });

  return merged;
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
