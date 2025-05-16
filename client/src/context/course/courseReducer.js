import {
    GET_COURSES,
    GET_COURSE,
    COURSE_ERROR,
    CLEAR_COURSE_ERROR,
    GET_COURSE_PROGRESS,
    GET_COURSE_DASHBOARD_STATS,
    CREATE_COURSE,
    UPDATE_COURSE,
    SET_LOADING,
    ADD_COURSE_SECTION,
    ADD_COURSE_LESSON,
    ADD_COURSE_QUIZ,
    ADD_COURSE_ASSIGNMENT,
    GET_COURSE_SECTIONS
  } from '../types';

  const courseReducer = (state, action) => {
    switch (action.type) {
      case CREATE_COURSE:
  return {
    ...state,
    currentCourse: action.payload,
    loading: false
  };
  case SET_LOADING:
    return {
      ...state,
      loading: true
    };
case UPDATE_COURSE:
  return {
    ...state,
    currentCourse: action.payload,
    courses: state.courses.map(course =>
      course._id === action.payload._id ? action.payload : course
    ),
    loading: false
  };
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
      case GET_COURSE_DASHBOARD_STATS:
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
      case GET_COURSE_SECTIONS:
        return {
          ...state,
          courseSections: action.payload,
          loading: false
        };
      case ADD_COURSE_SECTION:
        return {
          ...state,
          courseSections: [...state.courseSections, action.payload],
          loading: false
        };
      case ADD_COURSE_LESSON:
        return {
          ...state,
          courseLessons: [...state.courseLessons, action.payload],
          loading: false
        };
      case ADD_COURSE_QUIZ:
        return {
          ...state,
          courseQuizzes: [...state.courseQuizzes, action.payload],
          loading: false
        };
      case ADD_COURSE_ASSIGNMENT:
        return {
          ...state,
          courseAssignments: [...state.courseAssignments, action.payload],
          loading: false
        };
      default:
        return state;
    }
  };

  export default courseReducer;