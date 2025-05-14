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

const adminReducer = (state, action) => {
  switch (action.type) {
    case GET_DASHBOARD_STATS:
      return {
        ...state,
        dashboardStats: action.payload,
        loading: false
      };
    
    case GET_STUDENT_STATS:
      return {
        ...state,
        studentStats: action.payload,
        loading: false
      };
    
    case GET_COURSE_ANALYTICS:
      return {
        ...state,
        courseAnalytics: action.payload,
        loading: false
      };
    
    case GET_SUPPORT_INSIGHTS:
      return {
        ...state,
        supportInsights: action.payload,
        loading: false
      };
    
    case GET_TOP_COURSES:
      return {
        ...state,
        topCourses: action.payload.courses,
        totalCourses: action.payload.total || action.payload.courses.length,
        loading: false
      };
    
    case ADMIN_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case CLEAR_ADMIN_ERROR:
      return {
        ...state,
        error: null
      };
    
    case SET_ADMIN_LOADING:
      return {
        ...state,
        loading: true
      };
    
    default:
      return state;
  }
};

export default adminReducer;
