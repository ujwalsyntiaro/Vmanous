// Enrolled Students Roster & Digital Pass Service

const INITIAL_STUDENTS = [];

export const getStudents = () => {
  const stored = localStorage.getItem('vmanous_students');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const saveStudents = (students) => {
  localStorage.setItem('vmanous_students', JSON.stringify(students));
};

export const addStudent = (studentData) => {
  const students = getStudents();
  const newStudent = {
    id: `stu_${Date.now()}`,
    enrolledAt: new Date().toISOString(),
    paymentStatus: 'Paid',
    attendance: { day1: false, day2: false },
    ...studentData
  };
  const updated = [newStudent, ...students];
  saveStudents(updated);
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
          [day]: isPresent
        }
      };
    }
    return s;
  });
  saveStudents(updated);
  return updated;
};

export const deleteStudent = (id) => {
  const students = getStudents();
  const updated = students.filter(s => s.id !== id);
  saveStudents(updated);
  return updated;
};
