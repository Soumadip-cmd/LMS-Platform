import React, { useReducer } from 'react';
import axios from 'axios';
import CourseContext from './courseContext';
import courseReducer from './courseReducer';
import {
  GET_COURSES,
  GET_COURSE,
  COURSE_ERROR,
  CLEAR_COURSE_ERROR,
  GET_COURSE_PROGRESS,
  GET_DASHBOARD_STATS
} from '../types';

const CourseState = (props) => {
  const initialState = {
    courses: [],
    currentCourse: null,
    coursesProgress: [],
    dashboardStats: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(courseReducer, initialState);

  // Get published courses
  const getPublishedCourses = async () => {
    try {
      const res = await axios.get('/courses/published');
      
      dispatch({
        type: GET_COURSES,
        payload: res.data.courses
      });
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error fetching courses"
      });
    }
  };

  // Search courses with filters
  const searchCourses = async (params) => {
    try {
      const res = await axios.get('/courses/search', { params });
      
      dispatch({
        type: GET_COURSES,
        payload: res.data.courses
      });
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error searching courses"
      });
    }
  };

  // Get course by ID
  const getCourseById = async (courseId) => {
    try {
      const res = await axios.get(`/courses/${courseId}`);
      
      dispatch({
        type: GET_COURSE,
        payload: res.data.course
      });
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error fetching course"
      });
    }
  };

  // Get dashboard stats
  const getDashboardStats = async () => {
    try {
      const res = await axios.get('/progress/dashboard-stats');
      
      dispatch({
        type: GET_DASHBOARD_STATS,
        payload: res.data.stats
      });
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error fetching dashboard stats"
      });
    }
  };

  // Get all courses progress
  const getCoursesProgress = async (status = 'All') => {
    try {
      const res = await axios.get('/progress/courses-progress', {
        params: { status }
      });
      
      dispatch({
        type: GET_COURSE_PROGRESS,
        payload: res.data.progress
      });
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error fetching course progress"
      });
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_COURSE_ERROR });

  return (
    <CourseContext.Provider
      value={{
        courses: state.courses,
        currentCourse: state.currentCourse,
        coursesProgress: state.coursesProgress,
        dashboardStats: state.dashboardStats,
        loading: state.loading,
        error: state.error,
        getPublishedCourses,
        searchCourses,
        getCourseById,
        getDashboardStats,
        getCoursesProgress,
        clearErrors
      }}
    >
      {props.children}
    </CourseContext.Provider>
  );
};

export default CourseState;