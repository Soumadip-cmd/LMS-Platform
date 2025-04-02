import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Authentication/Login/Login";
import Signup from "./pages/Authentication/Signup/Signup";
import CourseSection from "./pages/courses/course.section/CourseSectionH";
import AuthState from "./context/auth/authState";
import ForgotPassword from "./pages/Authentication/ForgotPass/ForgotPassword";
import PrivacyPolicy from "./pages/Terms&condition/TermsService/TermsService";
import TermsService from "./pages/Terms&condition/TermsService/TermsService";
import LoginType from "./pages/Authentication/Login/LoginType";
import StudentDashboard from "./pages/Dashboard/Student/StudentDashboard";

function App() {
  return (
    <AuthState>
      <Router>
        <Navbar /> {/* The Navbar will be present on all pages */}
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          {/* Login as Instructor / Admin / Student */}
          <Route path="/loginType" element={<LoginType />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          {/* Fter signup to /course */}
          <Route path="/course" element={<CourseSection />} />
          
{/* dashboard */}

          <Route path="/studentDashboard" element={<StudentDashboard />} />

          <Route path="/termsofServices" element={<TermsService />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/" />} />{" "}
          {/* Redirect any unknown paths to home */}
        </Routes>
        <Footer />
      </Router>
    </AuthState>
  );
}

export default App;
