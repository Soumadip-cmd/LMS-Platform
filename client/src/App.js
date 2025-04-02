import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
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
import AuthContext from "./context/auth/authContext"; // Assuming you have this
import ForgotPassword from "./pages/Authentication/ForgotPass/ForgotPassword";
import PrivacyPolicy from "./pages/Terms&condition/TermsService/TermsService";
import TermsService from "./pages/Terms&condition/TermsService/TermsService";
import LoginType from "./pages/Authentication/Login/LoginType";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/Instructor/InstructorDashboard"; // Add this component
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard"; // Add this component

// Create a wrapper component to handle the conditional navbar logic
const AppContent = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { userType } = authContext; // Assuming your auth context tracks user type

  // Function to determine which navbar to show based on route and user type
  const renderNavbar = () => {
    const path = location.pathname;
    
    // Public routes that always show the default navbar
    const publicRoutes = ['/', '/login', '/loginType', '/signup', '/forgotPassword', '/termsofServices', '/privacyPolicy'];
    
    if (publicRoutes.includes(path)) {
      return <Navbar />;
    }
    
    // Dashboard routes with specific navbars
    if (path === '/studentDashboard' || userType === 'student') {
      return <StudentNavbar />;
    }
    
    if (path === '/instructorDashboard' || userType === 'instructor') {
      return <InstructorNavbar />;
    }
    
    if (path === '/adminDashboard' || userType === 'admin') {
      return <AdminNavbar />;
    }
    
    // Default to main navbar for any other routes
    return <Navbar />;
  };

  return (
    <>
      {renderNavbar()}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loginType" element={<LoginType />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/course" element={<CourseSection />} />
        
        {/* Dashboard routes */}
        <Route path="/studentDashboard" element={<StudentDashboard />} />
        <Route path="/instructorDashboard" element={<InstructorDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />

        <Route path="/termsofServices" element={<TermsService />} />
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthState>
      <Router>
        <AppContent />
      </Router>
    </AuthState>
  );
}

export default App;