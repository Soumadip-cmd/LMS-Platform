import React, { useReducer } from 'react';
import axios from 'axios';
import CourseContext from './courseContext';
import courseReducer from './courseReducer';
import { SERVER_URI } from '../../utlils/ServerUri';
import {
  GET_COURSES,
  GET_COURSE,
  COURSE_ERROR,
  CLEAR_COURSE_ERROR,
  GET_COURSE_PROGRESS,
  GET_COURSE_DASHBOARD_STATS,
  UPDATE_COURSE,
  CREATE_COURSE,
  SET_LOADING,
  ADD_COURSE_SECTION,
  ADD_COURSE_LESSON,
  ADD_COURSE_QUIZ,
  ADD_COURSE_ASSIGNMENT,
  GET_COURSE_SECTIONS
} from '../types';

const CourseState = (props) => {
  const initialState = {
    courses: [],
    currentCourse: null,
    coursesProgress: [],
    dashboardStats: null,
    loading: false,
    error: null,
    courseSections: [],
    courseLessons: [],
    courseQuizzes: [],
    courseAssignments: []
  };

  const [state, dispatch] = useReducer(courseReducer, initialState);
  axios.defaults.baseURL = SERVER_URI;




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



  const createCourse = async (courseData, formData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const res = await axios.post('/courses/create', formData, config);

      dispatch({
        type: CREATE_COURSE,
        payload: res.data.course
      });

      return res.data.course;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error creating course"
      });
    }
  };

  // Update live course settings
  const updateLiveCourseSettings = async (courseId, liveCourseSettings) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.patch(`/live/courses/${courseId}/live-settings`, liveCourseSettings, config);

      dispatch({
        type: UPDATE_COURSE,
        payload: res.data.course
      });

      return res.data.course;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error updating live course settings"
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
    dispatch({ type: SET_LOADING });
    try {
      // Add a timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await axios.get('/progress/dashboard-stats', {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.data && res.data.success) {
        dispatch({
          type: GET_COURSE_DASHBOARD_STATS,
          payload: res.data.stats || {
            overallProgress: 0,
            activeCourses: 0,
            achievements: 0,
            studyTime: 0
          }
        });
      } else {
        // Handle case where API returns success: false
        dispatch({
          type: COURSE_ERROR,
          payload: res.data?.message || "Error fetching dashboard stats"
        });

        // Return default stats to prevent UI issues
        dispatch({
          type: GET_COURSE_DASHBOARD_STATS,
          payload: {
            overallProgress: 0,
            activeCourses: 0,
            achievements: 0,
            studyTime: 0
          }
        });
      }
    } catch (err) {
      console.error("Dashboard stats error:", err);

      // Handle abort error differently
      if (err.name === 'AbortError') {
        dispatch({
          type: COURSE_ERROR,
          payload: "Request timed out. Please try again."
        });
      } else {
        dispatch({
          type: COURSE_ERROR,
          payload: err.response?.data?.message || "Error fetching dashboard stats"
        });
      }

      // Return default stats to prevent UI issues
      dispatch({
        type: GET_COURSE_DASHBOARD_STATS,
        payload: {
          overallProgress: 0,
          activeCourses: 0,
          achievements: 0,
          studyTime: 0
        }
      });
    }
  };

  // Get all courses progress
  const getCoursesProgress = async (status = 'All') => {
    dispatch({ type: SET_LOADING });
    try {
      // Add a timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await axios.get('/progress/courses-progress', {
        params: { status },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.data && res.data.success) {
        dispatch({
          type: GET_COURSE_PROGRESS,
          payload: res.data.progress || []
        });
      } else {
        // Handle case where API returns success: false
        dispatch({
          type: COURSE_ERROR,
          payload: res.data?.message || "Error fetching course progress"
        });

        // Return empty array to prevent UI issues
        dispatch({
          type: GET_COURSE_PROGRESS,
          payload: []
        });
      }
    } catch (err) {
      console.error("Course progress error:", err);

      // Handle abort error differently
      if (err.name === 'AbortError') {
        dispatch({
          type: COURSE_ERROR,
          payload: "Request timed out. Please try again."
        });
      } else {
        dispatch({
          type: COURSE_ERROR,
          payload: err.response?.data?.message || "Error fetching course progress"
        });
      }

      // Return empty array to prevent UI issues
      dispatch({
        type: GET_COURSE_PROGRESS,
        payload: []
      });
    }
  };
  const getTopCourses = async (params = {}) => {
    try {
      const { limit, language, level } = params;
      const queryParams = new URLSearchParams();

      if (limit) queryParams.append('limit', limit);
      if (language) queryParams.append('language', language);
      if (level) queryParams.append('level', level);

      const res = await axios.get(`/courses/top?${queryParams.toString()}`);

      dispatch({
        type: GET_COURSES,
        payload: res.data.topCourses
      });

      return res.data.topCourses;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error fetching top courses"
      });
    }
  };

  // Get featured courses with filtering
  const getFeaturedCourses = async (params = {}) => {
    dispatch({ type: SET_LOADING });
    try {
      const { limit, page, language, level, sortBy, price } = params;
      const queryParams = new URLSearchParams();

      if (limit) queryParams.append('limit', limit);
      if (page) queryParams.append('page', page);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (price) queryParams.append('price', price);

      // Handle array parameters
      if (language && Array.isArray(language)) {
        language.forEach(lang => queryParams.append('language', lang));
      } else if (language) {
        queryParams.append('language', language);
      }

      if (level && Array.isArray(level)) {
        level.forEach(lvl => queryParams.append('level', lvl));
      } else if (level) {
        queryParams.append('level', level);
      }

      const res = await axios.get(`/courses/featured?${queryParams.toString()}`);

      dispatch({
        type: GET_COURSES,
        payload: res.data.featuredCourses
      });

      return {
        courses: res.data.featuredCourses,
        pagination: res.data.pagination
      };
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error fetching featured courses"
      });
    }
  };
  // Course Material Management Methods

  // Create a new section for a course
  const createCourseSection = async (courseId, sectionData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post(`/courses/${courseId}/sections`, sectionData, config);

      dispatch({
        type: ADD_COURSE_SECTION,
        payload: res.data.section
      });

      return res.data.section;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error creating course section"
      });
    }
  };

  // Get all sections for a course
  const getCourseSections = async (courseId) => {
    try {
      const res = await axios.get(`/courses/${courseId}/sections`);

      dispatch({
        type: GET_COURSE_SECTIONS,
        payload: res.data.sections
      });

      return res.data.sections;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error fetching course sections"
      });
    }
  };

  // Add a lesson to a course section
  const addLessonToSection = async (courseId, sectionId, lessonData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const formData = new FormData();

      // Add lesson data to formData
      for (const key in lessonData) {
        if (key === 'featuredImage' || key === 'videoFile') {
          if (lessonData[key]) {
            formData.append(key, lessonData[key]);
          }
        } else if (key === 'exerciseFiles') {
          if (lessonData[key] && lessonData[key].length > 0) {
            for (let i = 0; i < lessonData[key].length; i++) {
              formData.append('exerciseFiles', lessonData[key][i]);
            }
          }
        } else if (key === 'video') {
          // Handle nested video object
          if (lessonData[key]) {
            if (lessonData[key].file) {
              formData.append('videoFile', lessonData[key].file);
            }
            if (lessonData[key].url) {
              formData.append('videoUrl', lessonData[key].url);
            }
            if (lessonData[key].playbackTime) {
              formData.append('videoPlaybackHours', lessonData[key].playbackTime.hours || 0);
              formData.append('videoPlaybackMinutes', lessonData[key].playbackTime.minutes || 0);
              formData.append('videoPlaybackSeconds', lessonData[key].playbackTime.seconds || 0);
            }
          }
        } else {
          formData.append(key, lessonData[key]);
        }
      }

      const res = await axios.post(`/courses/${courseId}/sections/${sectionId}/lessons`, formData, config);

      dispatch({
        type: ADD_COURSE_LESSON,
        payload: res.data.lesson
      });

      return res.data.lesson;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error adding lesson to section"
      });
    }
  };

  // Add a quiz to a course section
  const addQuizToSection = async (courseId, sectionId, quizData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post(`/courses/${courseId}/sections/${sectionId}/quizzes`, quizData, config);

      dispatch({
        type: ADD_COURSE_QUIZ,
        payload: res.data.quiz
      });

      return res.data.quiz;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error adding quiz to section"
      });
    }
  };

  // Add an assignment to a course section
  const addAssignmentToSection = async (courseId, sectionId, assignmentData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const formData = new FormData();

      // Add assignment data to formData
      for (const key in assignmentData) {
        if (key === 'attachments' && assignmentData[key] && assignmentData[key].length > 0) {
          for (let i = 0; i < assignmentData[key].length; i++) {
            formData.append('attachments', assignmentData[key][i]);
          }
        } else {
          formData.append(key, assignmentData[key]);
        }
      }

      const res = await axios.post(`/courses/${courseId}/sections/${sectionId}/assignments`, formData, config);

      dispatch({
        type: ADD_COURSE_ASSIGNMENT,
        payload: res.data.assignment
      });

      return res.data.assignment;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error adding assignment to section"
      });
    }
  };

  // Add a live lesson to a course section
  const addLiveLessonToSection = async (courseId, sectionId, liveLessonData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await axios.post(`/courses/${courseId}/sections/${sectionId}/live-lessons`, liveLessonData, config);

      dispatch({
        type: ADD_COURSE_LESSON,
        payload: { ...res.data.liveLesson, isLive: true }
      });

      return res.data.liveLesson;
    } catch (err) {
      dispatch({
        type: COURSE_ERROR,
        payload: err.response?.data?.message || "Error adding live lesson to section"
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
        courseSections: state.courseSections,
        courseLessons: state.courseLessons,
        courseQuizzes: state.courseQuizzes,
        courseAssignments: state.courseAssignments,
        getPublishedCourses,
        searchCourses,
        getCourseById,
        getDashboardStats,
        getCoursesProgress,
        clearErrors,
        createCourse,
        updateLiveCourseSettings,
        getTopCourses,
        getFeaturedCourses,
        createCourseSection,
        getCourseSections,
        addLessonToSection,
        addQuizToSection,
        addAssignmentToSection,
        addLiveLessonToSection
      }}
    >
      {props.children}
    </CourseContext.Provider>
  );
};

export default CourseState;