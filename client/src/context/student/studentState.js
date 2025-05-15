import React, { useReducer } from 'react';
import axios from 'axios';
import StudentContext from './studentContext';
import studentReducer from './studentReducer';
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

const StudentState = (props) => {
  const initialState = {
    students: [],
    currentStudent: null,
    totalStudents: 0,
    filtered: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(studentReducer, initialState);

  // Set loading
  const setLoading = () => dispatch({ type: SET_STUDENT_LOADING });

  // Get all students
  const getAllStudents = async (page = 1, limit = 10, status = 'All', searchTerm = '') => {
    setLoading();

    try {
      const res = await axios.get('/admin/users', {
        params: {
          page,
          limit,
          role: 'student',
          status,
          searchTerm
        }
      });

      if (res.data.success) {
        dispatch({
          type: GET_STUDENTS,
          payload: {
            students: res.data.users,
            total: res.data.total
          }
        });
      }

      return res.data;
    } catch (err) {
      dispatch({
        type: STUDENT_ERROR,
        payload: err.response?.data?.message || 'Error fetching students'
      });
      throw err;
    }
  };

  // Get student by ID
  const getStudentById = async (studentId) => {
    setLoading();

    try {
      const res = await axios.get(`/admin/users/${studentId}`);

      if (res.data.success) {
        dispatch({
          type: GET_STUDENT,
          payload: res.data.user
        });
      }

      return res.data.user;
    } catch (err) {
      dispatch({
        type: STUDENT_ERROR,
        payload: err.response?.data?.message || 'Error fetching student details'
      });
      throw err;
    }
  };

  // Update student
  const updateStudent = async (studentId, studentData) => {
    try {
      console.log('Updating student with data:', studentData);
      const res = await axios.put(`/admin/users/${studentId}`, studentData);
      console.log('Update response:', res.data);

      if (res.data.success) {
        dispatch({
          type: UPDATE_STUDENT,
          payload: res.data.user
        });
      }

      return res.data.user;
    } catch (err) {
      console.error('Error in updateStudent:', err);
      dispatch({
        type: STUDENT_ERROR,
        payload: err.response?.data?.message || 'Error updating student'
      });
      throw err;
    }
  };

  // Filter students
  const filterStudents = (text) => {
    dispatch({ type: FILTER_STUDENTS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Suspend student account
  const suspendStudent = async (studentId) => {
    try {
      const res = await axios.put(`/admin/users/${studentId}`, { status: 'suspended' });

      if (res.data.success) {
        dispatch({
          type: UPDATE_STUDENT,
          payload: res.data.user
        });
      }

      return res.data.user;
    } catch (err) {
      dispatch({
        type: STUDENT_ERROR,
        payload: err.response?.data?.message || 'Error suspending student account'
      });
      throw err;
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_STUDENT_ERROR });

  return (
    <StudentContext.Provider
      value={{
        students: state.students,
        currentStudent: state.currentStudent,
        totalStudents: state.totalStudents,
        filtered: state.filtered,
        loading: state.loading,
        error: state.error,
        getAllStudents,
        getStudentById,
        updateStudent,
        suspendStudent,
        filterStudents,
        clearFilter,
        clearErrors
      }}
    >
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentState;
