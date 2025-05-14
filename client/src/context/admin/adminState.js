import React, { useReducer } from 'react';
import axios from 'axios';
import AdminContext from './adminContext';
import adminReducer from './adminReducer';
import {
  GET_DASHBOARD_STATS,
  GET_STUDENT_STATS,
  GET_COURSE_ANALYTICS,
  GET_SUPPORT_INSIGHTS,
  GET_TOP_COURSES,
  ADMIN_ERROR,
  CLEAR_ADMIN_ERROR,
  SET_ADMIN_LOADING
} from '../types';

const AdminState = (props) => {
  const initialState = {
    dashboardStats: {
      users: {
        total: 0,
        active: 0,
        instructors: 0,
        newSignUps: 0,
        userGrowthTrend: 0,
        dailyActiveUsers: 0,
        dailyUsersTrend: 0
      },
      courses: {
        total: 0,
        active: 0,
        completionRate: 0,
        averageSessionTime: 0,
        sessionTimeTrend: 0
      },
      revenue: {
        total: 0,
        trend: 0,
        currentMonth: 0
      },
      support: {
        totalTickets: 0,
        openTickets: 0,
        resolvedTickets: 0
      }
    },
    studentStats: {
      totalStudents: 0,
      activeStudentsPerDay: 0,
      averageRating: 0
    },
    courseAnalytics: {
      totalCourses: 0,
      activeCoursesPerDay: 0,
      averageRating: 0
    },
    supportInsights: {
      totalTickets: 0,
      openTickets: 0,
      resolvedTickets: 0
    },
    topCourses: [],
    totalCourses: 0,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Set loading
  const setLoading = () => dispatch({ type: SET_ADMIN_LOADING });

  // Get dashboard statistics
  const getDashboardStats = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/admin/dashboard');
      
      if (res.data.success) {
        dispatch({
          type: GET_DASHBOARD_STATS,
          payload: res.data.stats
        });
      }
      
      return res.data.stats;
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response?.data?.message || 'Error fetching dashboard statistics'
      });
      throw err;
    }
  };

  // Get student statistics
  const getStudentStats = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/admin/student-stats');
      
      if (res.data.success) {
        dispatch({
          type: GET_STUDENT_STATS,
          payload: res.data.stats
        });
      }
      
      return res.data.stats;
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response?.data?.message || 'Error fetching student statistics'
      });
      throw err;
    }
  };

  // Get course analytics
  const getCourseAnalytics = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/admin/course-analytics');
      
      if (res.data.success) {
        dispatch({
          type: GET_COURSE_ANALYTICS,
          payload: res.data.stats
        });
      }
      
      return res.data.stats;
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response?.data?.message || 'Error fetching course analytics'
      });
      throw err;
    }
  };

  // Get support insights
  const getSupportInsights = async () => {
    setLoading();
    
    try {
      const res = await axios.get('/admin/support-insights');
      
      if (res.data.success) {
        dispatch({
          type: GET_SUPPORT_INSIGHTS,
          payload: res.data.stats
        });
      }
      
      return res.data.stats;
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response?.data?.message || 'Error fetching support insights'
      });
      throw err;
    }
  };

  // Get top courses
  const getTopCourses = async (limit = 10, page = 1) => {
    setLoading();
    
    try {
      const res = await axios.get('/admin/top-courses', {
        params: { limit, page }
      });
      
      if (res.data.success) {
        dispatch({
          type: GET_TOP_COURSES,
          payload: {
            courses: res.data.courses,
            total: res.data.total || res.data.courses.length
          }
        });
      }
      
      return res.data;
    } catch (err) {
      dispatch({
        type: ADMIN_ERROR,
        payload: err.response?.data?.message || 'Error fetching top courses'
      });
      throw err;
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_ADMIN_ERROR });

  return (
    <AdminContext.Provider
      value={{
        dashboardStats: state.dashboardStats,
        studentStats: state.studentStats,
        courseAnalytics: state.courseAnalytics,
        supportInsights: state.supportInsights,
        topCourses: state.topCourses,
        totalCourses: state.totalCourses,
        loading: state.loading,
        error: state.error,
        getDashboardStats,
        getStudentStats,
        getCourseAnalytics,
        getSupportInsights,
        getTopCourses,
        clearErrors
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminState;
