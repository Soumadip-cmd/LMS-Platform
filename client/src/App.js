import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Header/Navbar';
import Footer from './components/Footer/Footer';
import Login from './pages/Authentication/Login/Login';
import Signup from './pages/Authentication/Signup/Signup';
import CourseSection from './pages/courses/course.section/CourseSectionH';
import AuthState from './context/auth/authState';

function App() {
  return (
    <AuthState>
    <Router>
      <Navbar /> {/* The Navbar will be present on all pages */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/course" element={<CourseSection />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect any unknown paths to home */}
      </Routes>
      <Footer/>
    </Router>
    </AuthState>
  );
}

export default App;