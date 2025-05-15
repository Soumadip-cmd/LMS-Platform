import {
  GET_STUDENTS,
  GET_STUDENT,
  UPDATE_STUDENT,
  STUDENT_ERROR,
  SET_STUDENT_LOADING,
  CLEAR_STUDENT_ERROR,
  FILTER_STUDENTS,
  CLEAR_FILTER
} from '../types';

const studentReducer = (state, action) => {
  switch (action.type) {
    case GET_STUDENTS:
      return {
        ...state,
        students: action.payload.students,
        totalStudents: action.payload.total,
        loading: false
      };
    case GET_STUDENT:
      return {
        ...state,
        currentStudent: action.payload,
        loading: false
      };
    case UPDATE_STUDENT:
      return {
        ...state,
        students: state.students.map(student =>
          student._id === action.payload._id ? action.payload : student
        ),
        currentStudent: action.payload,
        loading: false
      };
    case STUDENT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case SET_STUDENT_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_STUDENT_ERROR:
      return {
        ...state,
        error: null
      };
    case FILTER_STUDENTS:
      return {
        ...state,
        filtered: state.students.filter(student => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return student.name.match(regex) || student.email.match(regex);
        })
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null
      };
    default:
      return state;
  }
};

export default studentReducer;
