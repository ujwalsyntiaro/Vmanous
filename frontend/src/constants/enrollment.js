import { GraduationCap, Building2, Presentation, Search, BookOpen, Code, Lightbulb, ClipboardCheck, Briefcase, TrendingUp } from 'lucide-react';

export const ENROLLMENT_ROLES = [
  {
    id: "student",
    title: "Student",
    description: "Learn AI and Data Science, participate in workshops, build projects, explore research and discover internship opportunities.",
    icon: GraduationCap,
    accentColor: "blue",
    journey: ["Learn", "Build", "Research", "Experience"],
    route: "/enroll/student",
    cta: "Join as Student"
  },
  {
    id: "college",
    title: "College",
    description: "Bring structured AI and Data Science workshops, practical learning and student development programs to your campus.",
    icon: Building2,
    accentColor: "green",
    journey: ["Workshop", "Students", "Projects", "Evaluation"],
    route: "/enroll/college",
    cta: "Partner as College"
  },
  {
    id: "trainer",
    title: "Trainer",
    description: "Share your expertise by contributing to AI, Data Science and technology-focused learning experiences.",
    icon: Presentation,
    accentColor: "purple",
    journey: ["Expertise", "Teach", "Mentor", "Impact"],
    route: "/enroll/trainer",
    cta: "Join as Trainer"
  }
];

export const VMANOUS_WORKFLOW = [
  { title: "DISCOVER", icon: Search },
  { title: "LEARN", icon: BookOpen },
  { title: "BUILD", icon: Code },
  { title: "RESEARCH", icon: Lightbulb },
  { title: "EVALUATE", icon: ClipboardCheck },
  { title: "EXPERIENCE", icon: Briefcase },
  { title: "GROW", icon: TrendingUp }
];

export const STUDENT_JOURNEY = [
  "Workshop",
  "Practical Learning",
  "Project",
  "Assessment",
  "Research",
  "Internship Opportunity",
  "Career Growth"
];

export const COLLEGE_JOURNEY = [
  "Campus Workshop",
  "Student Enrollment",
  "Hands-on Learning",
  "Projects",
  "Evaluation",
  "Student Development"
];

export const TRAINER_JOURNEY = [
  "Trainer",
  "Expertise",
  "Workshop Delivery",
  "Mentorship",
  "Student Impact"
];

export const ENROLLMENT_FAQS = [
  {
    question: "Who can join VMANOUS?",
    answer: "VMANOUS is open to students looking to learn AI and Data Science, colleges wanting to integrate practical workshops into their curriculum, and industry professionals or trainers eager to mentor and teach."
  },
  {
    question: "Can students enroll directly?",
    answer: "Yes, students can enroll directly into available workshops or programs. Additionally, students can participate through college-partnered workshops on their campus."
  },
  {
    question: "How can colleges partner with VMANOUS?",
    answer: "Colleges can partner with VMANOUS to bring structured AI and Data Science workshops directly to their campus. Select 'Partner as College' to initiate the partnership process."
  },
  {
    question: "How can trainers join?",
    answer: "Experienced professionals in AI, Data Science, and related fields can apply to join VMANOUS as trainers to conduct workshops and mentor students."
  },
  {
    question: "Are internships guaranteed?",
    answer: "No. Internship opportunities depend on eligibility, performance, evaluation and available opportunities."
  }
];
