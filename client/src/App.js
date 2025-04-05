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
import AuthContext from "./context/auth/authContext";
import ForgotPassword from "./pages/Authentication/ForgotPass/ForgotPassword";
import PrivacyPolicy from "./pages/Terms&condition/TermsService/TermsService";
import TermsService from "./pages/Terms&condition/TermsService/TermsService";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";
import InstructorDashboard from "./pages/Dashboard/Instructor/InstructorDashboard";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
// Create a wrapper component to handle the conditional navbar logic
const AppContent = () => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const { userType } = authContext; // Assuming your auth context tracks user type
  
  // Function to determine which navbar to show based on route and user type
  const renderNavbar = () => {
    const path = location.pathname;
    
    // Public routes that always show the default navbar
    const publicRoutes = [
      '/', 
      '/auth/login', 
      '/auth/login-type', 
      '/auth/signup', 
      '/auth/forgot-password', 
      '/legal/terms-of-service', 
      '/legal/privacy-policy'
    ];
    
    if (publicRoutes.includes(path)) {
      return <Navbar />;
    }
    
    // Dashboard routes with specific navbars
    if (path.startsWith('/dashboard/student') || userType === 'student') {
      return <StudentNavbar />;
    }
    
    if (path.startsWith('/dashboard/instructor') || userType === 'instructor') {
      return <InstructorNavbar />;
    }
    
    if (path.startsWith('/dashboard/admin') || userType === 'admin') {
      return <AdminNavbar />;
    }
    
    // Default to main navbar for any other routes
    return <Navbar />;
  };

  return (
    // <>
    //   {renderNavbar()}
    //   <Toaster position="top-center" reverseOrder={false} />
    //   <Routes>
    //     {/* Public routes */}
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/courses" element={<CourseSection />} /> //after signup
        
    //     {/* Authentication routes */}
    //     <Route path="/auth/login" element={<Login />} />
    //     <Route path="/auth/forgot-password" element={<ForgotPassword />} />
    //     <Route path="/auth/signup" element={<Signup />} />
        
    //     {/* Dashboard routes */}
    //     <Route path="/dashboard/student" element={<StudentDashboard />} />   //after login
    //     <Route path="/dashboard/instructor" element={<InstructorDashboard />} /> //after approved instructre page 
    //     <Route path="/dashboard/admin" element={<AdminDashboard />} />   //same for admin
        
    //     {/* Legal routes */}
    //     <Route path="/legal/terms-of-service" element={<TermsService />} />
    //     <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        
    //     {/* Fallback route */}
    //     <Route path="*" element={<Navigate to="/" />} />
    //   </Routes>
    //   <Footer />
    // </>
    <>
    {renderNavbar()}
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<CourseSection />} />
      
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
          // </ProtectedRoute>
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
      <Router>
        <AppContent />
      </Router>
    </AuthState>
  );
}

export default App;