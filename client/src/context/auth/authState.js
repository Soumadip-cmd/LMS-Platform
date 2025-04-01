// src/context/auth/AuthState.js
import React, { useReducer, useEffect,useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import AuthContext from "./authContext.js";
import authReducer from "./authReducer.js";
import setAuthToken from "../../utlils/setAuthToken.js";
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
} from "../types.js";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
    socket: null,
    onlineUsers: []
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const [languages, setLanguages] = useState([]);

  // Configure axios base URL
  const SERVER_URI = "http://localhost:8000/api/v1";
  axios.defaults.baseURL = SERVER_URI;

  // Set auth token for all requests if present
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  }, []);



  




  // Initialize socket connection
  const initializeSocket = () => {
    if (state.isAuthenticated && !state.socket) {
      const SOCKET_URI = "http://localhost:8000"; // Socket server URI
      
      const newSocket = io(SOCKET_URI, {
        withCredentials: true,
        auth: {
          token: localStorage.getItem("token")
        }
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
        
        // Authenticate socket with user ID
        if (state.user && state.user._id) {
          newSocket.emit("authenticate", state.user._id);
        }
        
        dispatch({
          type: SOCKET_CONNECTED,
          payload: newSocket
        });
      });

      // Listen for online users updates
      newSocket.on("onlineUsers", (users) => {
        dispatch({
          type: UPDATE_ONLINE_USERS,
          payload: users
        });
      });

      // Listen for user status changes
      newSocket.on("userStatus", ({ userId, status }) => {
        // Update the onlineUsers list based on status changes
        dispatch({
          type: UPDATE_ONLINE_USERS,
          payload: status 
            ? [...state.onlineUsers, userId]
            : state.onlineUsers.filter(id => id !== userId)
        });
      });

      // Listen for private messages
      newSocket.on("privateMessage", (messageData) => {
        // Handle incoming private messages
        console.log("Private message received:", messageData);
      });

      // Listen for notifications
      newSocket.on("notification", (notification) => {
        // Handle incoming notifications
        console.log("Notification received:", notification);
      });

      // Listen for disconnect events
      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      // Listen for errors
      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      return newSocket;
    }
    return null;
  };

  // Clean up socket connection
  const disconnectSocket = () => {
    if (state.socket) {
      state.socket.disconnect();
      dispatch({ type: SOCKET_DISCONNECTED });
    }
  };



  const fetchAllLanguages = async () => {
    try {
      const res = await axios.get(`${SERVER_URI}/languages/all`);
      setLanguages(res.data.languages || []);
      return res.data.languages;
    } catch (err) {
      console.error("Failed to fetch languages:", err);
      return [];
    }
  };
  

  useEffect(() => {
    fetchAllLanguages();
  }, []);
  // Load User
  const loadUser = async () => {
    try {
      const res = await axios.get(`${SERVER_URI}/users/profile`);
      
      dispatch({
        type: USER_LOADED,
        payload: res.data.user
      });

      // Initialize socket after user is loaded
      initializeSocket();
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User - initiateRegistration endpoint
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/auth/register`, 
        formData, 
        config
      );
      
      return res.data; // Return the data with activation token for OTP verification
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "Registration failed"
      });
      throw err;
    }
  };

  // Verify OTP and Complete Registrationm (emal and password method)
  const verifyOTPAndRegister = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/auth/verify-otp`, 
        data, 
        config
      );
      
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
      
      loadUser();
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "OTP verification failed"
      });
      throw err;
    }
  };

  // Resend OTP (email and password method)
  const resendOTP = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/auth/resend-otp`, 
        data, 
        config
      );
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "Failed to resend OTP"
      });
      throw err;
    }
  };

  // Login User  (email and password method)
  const login = async (email, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/auth/login`,
        { email, password },
        config
      );
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      
      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.message || "Login failed"
      });
      throw err;
    }
  };

  // Social Login (Google/Facebook) 
  const socialLogin = async (userData) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/social/social-login`,
        userData,
        config
      );
      
      // Check if additional verification is needed
      if (res.data.needsPhoneVerification) {
        return res.data; // Return data for phone verification
      }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      
      loadUser();
      return res.data;
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.message || "Social login failed"
      });
      throw err;
    }
  };

  // Complete Social Login with phone verification
  const completeSocialRegistration = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/social/complete-social-registration`,
        data,
        config
      );
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      
      loadUser();
      return res.data;
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.message || "Verification failed"
      });
      throw err;
    }
  };

//resend google otp
  const resendGooglePhoneOTP = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
  
    try {
      const res = await axios.post(
        `${SERVER_URI}/social/resend-phone-otp`, 
        data, 
        config
      );
      
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "Failed to resend OTP"
      });
      throw err;
    }
  };
  

  // Logout
  const logout = async () => {
    try {
      // Notify server about logout
      if (state.socket) {
        state.socket.emit("logout", state.user?._id);
      }
      
      // Disconnect socket
      disconnectSocket();
      
      // Call the API to logout
      await axios.post(`${SERVER_URI}/auth/logout`);
      
      dispatch({ type: LOGOUT });
    } catch (err) {
      console.error("Logout error:", err);
      dispatch({ type: LOGOUT });
    }
  };

// -------------------------Forget password----------------------------------

  // Forgot Password
  const forgotPassword = async (emailOrPhone) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/auth/forgotPassword`,
        { emailOrPhone },
        config
      );
      
      return res.data;
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: err.response?.data?.message || "Password reset request failed"
      });
      throw err;
    }
  };


  // Verify Reset OTP
  const verifyResetOTP = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/auth/verifyResetOTP`,
        data,
        config
      );
      
      return res.data;
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: err.response?.data?.message || "OTP verification failed"
      });
      throw err;
    }
  };

  // Reset Password
  const resetPassword = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(
        `${SERVER_URI}/auth/resetPassword`,
        data,
        config
      );
      
      return res.data;
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: err.response?.data?.message || "Password reset failed"
      });
      throw err;
    }
  };

  // Send a private message
  const sendPrivateMessage = (recipientId, message) => {
    if (state.socket && state.isAuthenticated) {
      state.socket.emit("privateMessage", { recipientId, message });
      return true;
    }
    return false;
  };

  // Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      const res = await axios.get(`${SERVER_URI}/users/online`);
      
      dispatch({
        type: UPDATE_ONLINE_USERS,
        payload: res.data.onlineUsers
      });
      
      return res.data.onlineUsers;
    } catch (err) {
      console.error("Failed to fetch online users:", err);
      return [];
    }
  };

  // Check if a specific user is online
  const checkUserOnlineStatus = async (userId) => {
    try {
      const res = await axios.get(`${SERVER_URI}/users/${userId}/online`);
      return res.data.isOnline;
    } catch (err) {
      console.error("Failed to check user status:", err);
      return false;
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // Clean up socket connection when component unmounts
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);
 
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        socket: state.socket,
        onlineUsers: state.onlineUsers,
        languages,
        fetchAllLanguages,
        register,
        login,
        socialLogin,
        verifyOTPAndRegister,
        resendOTP,
        completeSocialRegistration,
        resendGooglePhoneOTP,
        logout,
        loadUser,
        clearErrors,
        sendPrivateMessage,
        fetchOnlineUsers,
        checkUserOnlineStatus,
        forgotPassword,
        verifyResetOTP,
        resetPassword
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;