import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Placeholder Pages
import Home from './pages/Home';
import AISummit from './pages/AISummit';
import DataScience from './pages/DataScience';
import CaseStudies from './pages/CaseStudies';
import ForColleges from './pages/ForColleges';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Enroll from './pages/Enroll';
import StudentEnrollment from './pages/enroll/StudentEnrollment';
import CollegePartnership from './pages/enroll/CollegePartnership';
import TrainerRegistration from './pages/enroll/TrainerRegistration';
import Payment from './pages/Payment';
import Pass from './pages/Pass';

// Admin Pages
import DashboardHome from './pages/admin/DashboardHome';
import PlaceholderPage from './components/admin/PlaceholderPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ai-summit" element={<AISummit />} />
          <Route path="/data-science" element={<DataScience />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/for-colleges" element={<ForColleges />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/enroll" element={<Enroll />} />
          <Route path="/enroll/student" element={<StudentEnrollment />} />
          <Route path="/enroll/college" element={<CollegePartnership />} />
          <Route path="/enroll/trainer" element={<TrainerRegistration />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/pass" element={<Pass />} />
        </Route>



        {/* Future Layout Placeholders */}
        {/* <Route element={<DashboardLayout />}> ... </Route> */}
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          
          {/* Management */}
          <Route path="students" element={<PlaceholderPage title="Students Management" />} />
          <Route path="colleges" element={<PlaceholderPage title="Colleges Management" />} />
          <Route path="trainers" element={<PlaceholderPage title="Trainers Management" />} />
          <Route path="organizations" element={<PlaceholderPage title="Organizations Management" />} />
          
          {/* Programs */}
          <Route path="ai-summits" element={<PlaceholderPage title="AI Summits Management" />} />
          <Route path="workshops" element={<PlaceholderPage title="Workshops Management" />} />
          <Route path="data-science" element={<PlaceholderPage title="Data Science Programs" />} />
          <Route path="internships" element={<PlaceholderPage title="Internships Management" />} />
          
          {/* Enrollment */}
          <Route path="applications" element={<PlaceholderPage title="Applications" />} />
          <Route path="enrollments" element={<PlaceholderPage title="Enrollments" />} />
          <Route path="attendance" element={<PlaceholderPage title="Attendance" />} />
          
          {/* Research */}
          <Route path="rd-projects" element={<PlaceholderPage title="R&D Projects" />} />
          
          {/* Evaluation */}
          <Route path="assessments" element={<PlaceholderPage title="Assessments" />} />
          <Route path="evaluations" element={<PlaceholderPage title="Student Evaluations" />} />
          
          {/* Certificates */}
          <Route path="certificates" element={<PlaceholderPage title="Certificates Management" />} />
          
          {/* Platform */}
          <Route path="analytics" element={<PlaceholderPage title="Platform Analytics" />} />
          <Route path="announcements" element={<PlaceholderPage title="Announcements" />} />
          <Route path="settings" element={<PlaceholderPage title="Platform Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
