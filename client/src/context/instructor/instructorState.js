import React, { useReducer } from 'react';
import axios from 'axios';
import InstructorContext from './instructorContext';
import instructorReducer from './instructorReducer';
import { SERVER_URI } from '../../utlils/ServerUri';
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

const InstructorState = (props) => {
  const initialState = {
    instructors: [],
    currentInstructor: null,
    totalInstructors: 0,
    filtered: null,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(instructorReducer, initialState);

  // Set axios base URL
  axios.defaults.baseURL = SERVER_URI;

  // Set loading
  const setLoading = () => dispatch({ type: SET_INSTRUCTOR_LOADING });

  // Get all instructors
  const getAllInstructors = async (page = 1, limit = 10, status = 'All') => {
    setLoading();

    try {
      const res = await axios.get('/admin/instructors', {
        params: { page, limit, status }
      });

      if (res.data.success) {
        dispatch({
          type: GET_INSTRUCTORS,
          payload: {
            instructors: res.data.instructors,
            total: res.data.total
          }
        });
      }

      return res.data;
    } catch (err) {
      dispatch({
        type: INSTRUCTOR_ERROR,
        payload: err.response?.data?.message || 'Error fetching instructors'
      });
      throw err;
    }
  };

  // Get instructor by ID
  const getInstructorById = async (instructorId) => {
    setLoading();

    try {
      const res = await axios.get(`/admin/instructors/${instructorId}`);

      if (res.data.success) {
        dispatch({
          type: GET_INSTRUCTOR,
          payload: res.data.instructor
        });
      }

      return res.data.instructor;
    } catch (err) {
      dispatch({
        type: INSTRUCTOR_ERROR,
        payload: err.response?.data?.message || 'Error fetching instructor details'
      });
      throw err;
    }
  };

  // Update instructor status
  const updateInstructorStatus = async (instructorId, status) => {
    try {
      const res = await axios.put(`/admin/instructors/${instructorId}/status`, { status });

      if (res.data.success) {
        dispatch({
          type: UPDATE_INSTRUCTOR_STATUS,
          payload: res.data.instructor
        });
      }

      return res.data.instructor;
    } catch (err) {
      dispatch({
        type: INSTRUCTOR_ERROR,
        payload: err.response?.data?.message || 'Error updating instructor status'
      });
      throw err;
    }
  };

  // Filter instructors
  const filterInstructors = (text) => {
    dispatch({ type: FILTER_INSTRUCTORS, payload: text });
  };

  // Clear filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_INSTRUCTOR_ERROR });

  return (
    <InstructorContext.Provider
      value={{
        instructors: state.instructors,
        currentInstructor: state.currentInstructor,
        totalInstructors: state.totalInstructors,
        filtered: state.filtered,
        loading: state.loading,
        error: state.error,
        getAllInstructors,
        getInstructorById,
        updateInstructorStatus,
        filterInstructors,
        clearFilter,
        clearErrors
      }}
    >
      {props.children}
    </InstructorContext.Provider>
  );
};

export default InstructorState;
