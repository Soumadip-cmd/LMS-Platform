// src/context/auth/authReducer.js
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    USER_LOADED,
    AUTH_ERROR,
    CLEAR_ERRORS,
    SOCKET_CONNECTED,
    SOCKET_DISCONNECTED,
    UPDATE_ONLINE_USERS
  } from "../types";
  
  const authReducer = (state, action) => {
    switch (action.type) {
      case USER_LOADED:
        return {
          ...state,
          isAuthenticated: true,
          loading: false,
          user: action.payload
        };
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        localStorage.setItem("token", action.payload.token);
        return {
          ...state,
          token: action.payload.token,
          isAuthenticated: true,
          loading: false
        };
      case SOCKET_CONNECTED:
        return {
          ...state,
          socket: action.payload
        };
      case SOCKET_DISCONNECTED:
        return {
          ...state,
          socket: null
        };
      case UPDATE_ONLINE_USERS:
        return {
          ...state,
          onlineUsers: action.payload
        };
      case REGISTER_FAIL:
      case LOGIN_FAIL:
      case AUTH_ERROR:
      case LOGOUT:
        localStorage.removeItem("token");
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
          error: action.payload,
          socket: null,
          onlineUsers: []
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null
        };
      default:
        return state;
    }
  };
  
  export default authReducer;