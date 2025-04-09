import { 
    GET_COURSES,
    GET_COURSE,
    COURSE_ERROR,
    CLEAR_COURSE_ERROR,
    GET_COURSE_PROGRESS,
    GET_DASHBOARD_STATS
  } from '../types';
  
  const courseReducer = (state, action) => {
    switch (action.type) {
      case GET_COURSES:
        return {
          ...state,
          courses: action.payload,
          loading: false
        };
      case GET_COURSE:
        return {
          ...state,
          currentCourse: action.payload,
          loading: false
        };
      case GET_COURSE_PROGRESS:
        return {
          ...state,
          coursesProgress: action.payload,
          loading: false
        };
      case GET_DASHBOARD_STATS:
        return {
          ...state,
          dashboardStats: action.payload,
          loading: false
        };
      case COURSE_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case CLEAR_COURSE_ERROR:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  export default courseReducer;