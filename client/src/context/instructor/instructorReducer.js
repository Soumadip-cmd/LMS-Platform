import {
  GET_INSTRUCTORS,
  GET_INSTRUCTOR,
  UPDATE_INSTRUCTOR_STATUS,
  INSTRUCTOR_ERROR,
  CLEAR_INSTRUCTOR_ERROR,
  SET_INSTRUCTOR_LOADING,
  FILTER_INSTRUCTORS,
  CLEAR_FILTER
} from '../types';

const instructorReducer = (state, action) => {
  switch (action.type) {
    case GET_INSTRUCTORS:
      return {
        ...state,
        instructors: action.payload.instructors,
        totalInstructors: action.payload.total || action.payload.instructors.length,
        loading: false
      };
    
    case GET_INSTRUCTOR:
      return {
        ...state,
        currentInstructor: action.payload,
        loading: false
      };
    
    case UPDATE_INSTRUCTOR_STATUS:
      return {
        ...state,
        instructors: state.instructors.map(instructor => 
          instructor._id === action.payload._id ? action.payload : instructor
        ),
        loading: false
      };
    
    case FILTER_INSTRUCTORS:
      return {
        ...state,
        filtered: state.instructors.filter(instructor => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return (
            instructor.name.match(regex) || 
            instructor._id.match(regex) ||
            instructor.status.match(regex)
          );
        })
      };
    
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    
    case INSTRUCTOR_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case CLEAR_INSTRUCTOR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case SET_INSTRUCTOR_LOADING:
      return {
        ...state,
        loading: true
      };
    
    default:
      return state;
  }
};

export default instructorReducer;
