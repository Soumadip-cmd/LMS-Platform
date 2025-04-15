import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Header/Navbar";
import StudentNavbar from "./components/Header/StudentNavbar";
import InstructorNavbar from "./components/Header/InstructorNavbar";
import AdminNavbar from "./components/Header/AdminNavbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Authentication/Login/Login";
import Signup from "./pages/Authentication/Signup/Signup";
import CourseSection from "./pages/courses/course.section/CourseSectionH";
import AuthState from "./context/auth/authState";
import AuthContext from "./context/auth/authContext";
import ForgotPassword from "./pages/Authentication/ForgotPass/ForgotPassword";
import TermsService from "./pages/Terms&condition/TermsService/TermsService";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/Instructor/InstructorDashboard";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCourse from "./pages/Dashboard/Admin/courses/AdminCourse";
import ManageStudents from "./pages/Dashboard/Admin/Students/ManageStudents";
import ManageInstructors from "./pages/Dashboard/Admin/instructors/ManageInstructors";
import Assignment from "./pages/Dashboard/Admin/assignment/Assignment";
import Mocktest from "./pages/Dashboard/Admin/mocktest/Mocktest";
import Messages from "./pages/Dashboard/Admin/Messages/Messages";
import AdminSettings from "./pages/Dashboard/Admin/settings/AdminSettings";
import ContactUs from "./pages/support/ContactUs";
import CourseState from "./context/course/CourseState";
import CourseType from "./pages/ExamsNav/courseType/CourseType";
import GeneralPractice from "./pages/ExamsNav/Practice/GeneralPractice";
import LiveOnline from "./pages/Details/LiveOnline/LiveOnline";
import RecordedClass from "./pages/Details/Recorded/RecordedClass";
import BecomeAnInstructor from "./pages/Dashboard/Student/BecomeAnInstructor/BecomeAnInstructor";
import PrivacyPolicy from "./pages/Terms&condition/PrivacyPolicy/PrivacyPolicy";
import AddCourse from "./pages/Dashboard/Admin/courses/AddCourse/AddCourse";
import GeneralPracticeReading from "./pages/courses/Practice/Reading/GeneralPracticeReading";
import ResourcesHomePage from "./pages/ResourcesDashboard/Home/ResourcesHomePage";
// You'll need to create this component

// ScrollToTop component to handle scrolling on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { userType } = authContext; // Assuming your auth context tracks user type

  // Function to determine which navbar to show based on route and user type
  const renderNavbar = () => {
    const path = location.pathname;

    // Public routes that always show the default navbar
    const publicRoutes = [
      "/",
      "/auth/login",
      "/auth/login-type",
      "/auth/signup",
      "/auth/forgot-password",
      "/legal/terms-of-service",
      "/legal/privacy-policy",
      "/become-an-instructor",
      "/general-practice-reading",
    ];

    if (publicRoutes.includes(path)) {
      return <Navbar />;
    }

    // Dashboard routes with specific navbars
    if (path.startsWith("/dashboard/student") || userType === "student") {
      return <StudentNavbar />;
    }

    if (path.startsWith("/dashboard/instructor") || userType === "instructor") {
      return <InstructorNavbar />;
    }

    if (path.startsWith("/dashboard/admin") || userType === "admin") {
      return <AdminNavbar />;
    }

    // Default to main navbar for any other routes
    return <Navbar />;
  };

  return (
    <>
      {/* Add ScrollToTop component here */}
      <ScrollToTop />
      {renderNavbar()}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseSection />} />
        <Route path="/exams" element={<CourseType />} />

        {/* Course Details Routes */}
        <Route path="/details/live-online" element={<LiveOnline />} />
        <Route path="/details/recorded-class" element={<RecordedClass />} />

        {/* exams home page */}
        <Route path="/general-practice" element={<GeneralPractice />} />

        {/* Authentication routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* Protected Dashboard routes */}
        <Route
          path="/dashboard/student"
          element={
            // <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/instructor"
          element={
            // <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboard />
            //</ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            // <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
            // </ProtectedRoute>
          }
        />
        {/* dasboard -admin routes */}
        <Route path="/dashboard/admin/courses" element={<AdminCourse />} />
        <Route path="/dashboard/admin/students" element={<ManageStudents />} />
        <Route
          path="/dashboard/admin/instructors"
          element={<ManageInstructors />}
        />
        <Route path="/dashboard/admin/assignments" element={<Assignment />} />
        <Route path="/dashboard/admin/mock-tests" element={<Mocktest />} />
        <Route path="/dashboard/admin/messages" element={<Messages />} />
        <Route path="/dashboard/admin/settings" element={<AdminSettings />} />

        {/* dashboard admin -course */}
        <Route
          path="/dashboard/admin/courses/add-course"
          element={<AddCourse />}
        />

        {/* dashboard student routes */}
        <Route path="/become-an-instructor" element={<BecomeAnInstructor />} />

        {/* general-practice */}
        <Route
          path="/general-practice-reading"
          element={<GeneralPracticeReading />}
        />








        {/* Resource Dashboard */}
        <Route path="/resources/home" element={<ResourcesHomePage />} />




        {/* Support - Contact Us */}
        <Route path="/support/contact-us" element={<ContactUs />} />

        {/* Legal routes */}
        <Route path="/legal/terms-of-service" element={<TermsService />} />
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthState>
      <CourseState>
        <Router>
          <AppContent />
        </Router>
      </CourseState>
    </AuthState>
  );
}

export default App;
