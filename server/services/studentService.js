// Enrolled Students Roster & Digital Pass Service

const INITIAL_STUDENTS = [
  {
    id: 'stu_101',
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 9876543210',
    collegeName: 'G H Raisoni College of Engineering',
    programTitle: 'AI SUMMIT WORKSHOP 2030',
    venueLocation: 'Main Auditorium, Nagpur Campus',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    degree: 'B.Tech',
    passCode: 'PASS-GHRCEM-801',
    paymentStatus: 'Paid',
    attendance: { day1: true, day2: false },
    enrolledAt: '2026-08-18T10:15:30Z'
  },
  {
    id: 'stu_102',
    studentName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 9823456789',
    collegeName: 'National Institute of Technology',
    programTitle: 'AI SUMMIT WORKSHOP 2030',
    venueLocation: 'NIT Campus Auditorium, Trichy',
    branch: 'Artificial Intelligence & Data Science',
    year: '4th Year',
    degree: 'B.Tech',
    passCode: 'PASS-NIT-802',
    paymentStatus: 'Paid',
    attendance: { day1: true, day2: true },
    enrolledAt: '2026-08-18T11:20:00Z'
  },
  {
    id: 'stu_103',
    studentName: 'Ananya Verma',
    email: 'ananya.v@example.com',
    phone: '+91 9654321098',
    collegeName: 'Indian Institute of Technology Bombay',
    programTitle: 'AI SUMMIT WORKSHOP 2030',
    venueLocation: 'Victor Menezes Convention Centre',
    branch: 'Computer Science',
    year: '3rd Year',
    degree: 'B.Tech',
    passCode: 'PASS-IITB-804',
    paymentStatus: 'Paid',
    attendance: { day1: false, day2: false },
    enrolledAt: '2026-08-18T15:30:00Z'
  }
];

export const getStudents = () => {
  const stored = localStorage.getItem('vmanous_students');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('vmanous_students', JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
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
