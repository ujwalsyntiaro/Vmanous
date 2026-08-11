import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';

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
        </Route>



        {/* Future Layout Placeholders */}
        {/* <Route element={<DashboardLayout />}> ... </Route> */}
        {/* <Route element={<AdminLayout />}> ... </Route> */}
      </Routes>
    </Router>
  );
};

export default App;
