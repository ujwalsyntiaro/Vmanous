import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PaymentCallback from './pages/PaymentCallback';
import Pass from './pages/Pass';
import Application from './pages/Application';
import ScrollToTop from './components/layout/ScrollToTop';

// Legal Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CancellationPolicy from './pages/CancellationPolicy';
import RefundPolicy from './pages/RefundPolicy';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import DashboardHome from './pages/admin/DashboardHome';
import ManagePrograms from './pages/admin/ManagePrograms';
import ManageApplications from './pages/admin/ManageApplications';
import ManageColleges from './pages/admin/ManageColleges';
import ManageStudents from './pages/admin/ManageStudents';
import ManageWorkshops from './pages/admin/ManageWorkshops';
import ManageAttendance from './pages/admin/ManageAttendance';
import ManageSettings from './pages/admin/ManageSettings';
import ManageGallery from './pages/admin/ManageGallery';
import ManageCertificates from './pages/admin/ManageCertificates';
import PlaceholderPage from './components/admin/PlaceholderPage';


const App = () => {
  return (
    <Router>
      <ScrollToTop />
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
          <Route path="/application" element={<Application />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/pass" element={<Pass />} />

          {/* Legal Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
        </Route>

        {/* Admin/VPanel Login Gateway (Public) */}
        <Route path="/vpanel/login" element={<AdminLogin />} />
        <Route path="/cpanel/login" element={<Navigate to="/vpanel/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/vpanel/login" replace />} />
        <Route path="/cpanel/*" element={<Navigate to="/vpanel" replace />} />
        <Route path="/admin" element={<Navigate to="/vpanel" replace />} />

        {/* Protected VPanel Dashboard Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/vpanel" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />

            {/* Programs */}
            <Route path="ai-summits" element={<ManagePrograms />} />
            <Route path="workshops" element={<ManageWorkshops />} />

            {/* Enrollment */}
            <Route path="applications" element={<ManageApplications />} />
            <Route path="enrollments" element={<ManageStudents />} />

            {/* Gallery Management */}
            <Route path="gallery" element={<ManageGallery />} />

            {/* Certificates */}
            <Route path="certificates" element={<ManageCertificates />} />


            {/* Platform */}
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
