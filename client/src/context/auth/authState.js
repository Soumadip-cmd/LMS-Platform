
import React, { useReducer, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import AuthContext from "./authContext.js";
import authReducer from "./authReducer.js";
import { SERVER_URI } from '../../utlils/ServerUri';
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
  UPDATE_ONLINE_USERS,
  RESOURCE_SIGNUP_FAIL,
  RESOURCE_SIGNUP_SUCCESS,
  SET_LOADING
} from "../types.js";

const AuthState = (props) => {
  const initialState = {
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null,
    socket: null,
    onlineUsers: []
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const [languages, setLanguages] = useState([]);


  useEffect(() => {
    // Try to load user when the app first loads
    const loadInitialUser = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken');

        if (token) {
          console.log('Found token in localStorage, attempting to load user');

          // Set the token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Try to load the user
          await loadUser();
          console.log('User loaded successfully on app start');
        } else {
          console.log('No token found in localStorage on app start');
          dispatch({
            type: AUTH_ERROR
          });
        }
      } catch (err) {
        // User not authenticated or token expired
        console.error('Failed to load user on app start:', err);

        // Clear any invalid tokens
        localStorage.removeItem('authToken');
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        delete axios.defaults.headers.common['Authorization'];

        dispatch({
          type: AUTH_ERROR
        });
      } finally {
        // Ensure loading is set to false
        dispatch({
          type: SET_LOADING,
          payload: false
        });
      }
    };

    loadInitialUser();
  }, []);
  // Configure axios base URL and credentials
  axios.defaults.baseURL = SERVER_URI;
  axios.defaults.withCredentials = true; // Allow sending cookies cross-origin

  // Initialize socket connection
  const initializeSocket = () => {
    if (state.isAuthenticated && !state.socket) {
      const SOCKET_URI = SERVER_URI.split('/api/v1')[0]; // Socket server URI (without API path)

      const newSocket = io(SOCKET_URI, {
        withCredentials: true
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
        dispatch({
          type: UPDATE_ONLINE_USERS,
          payload: status
            ? [...state.onlineUsers, userId]
            : state.onlineUsers.filter(id => id !== userId)
        });
      });

      // Listen for private messages
      newSocket.on("privateMessage", (messageData) => {
        console.log("Private message received:", messageData);
      });

      // Listen for notifications
      newSocket.on("notification", (notification) => {
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
      const res = await axios.get(`/languages/all`);
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
      console.log('Loading user profile...');

      // Check if we have a token in localStorage
      const token = localStorage.getItem('authToken');

      // Create config with token if available
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // Always send cookies
      };

      // Add token to headers if available
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Using token from localStorage for profile request');
      } else {
        console.log('No token in localStorage, relying on cookies');
      }

      const res = await axios.get(`/users/profile`, config);

      console.log('User profile loaded:', res.data.user);

      dispatch({
        type: USER_LOADED,
        payload: res.data.user
      });

      // Initialize socket after user is loaded
      initializeSocket();

      return res.data.user;
    } catch (err) {
      console.error('Error loading user:', err.response?.data || err);

      // Check for specific error types
      if (err.response?.status === 401) {
        // Token is missing or invalid - clear any existing tokens
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');

        // Also clear the Authorization header
        delete axios.defaults.headers.common['Authorization'];

        console.log('Authentication tokens cleared due to 401 error');
      } else if (err.response?.status === 403) {
        console.error('Access forbidden. User may not have required permissions.');
      } else if (err.response?.status === 429) {
        console.error('Rate limit exceeded. Too many requests.');
      }

      dispatch({ type: AUTH_ERROR });
      throw err;
    }
  };

  // Login User (email and password method)
  // const login = async (email, password) => {
  //   const config = {
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   };

  //   try {
  //     const res = await axios.post(
  //       `/auth/login`,
  //       { email, password },
  //       config
  //     );

  //     // Dispatch login success
  //     dispatch({
  //       type: LOGIN_SUCCESS,
  //       payload: res.data
  //     });

  //     // Load user after successful login
  //     await loadUser();

  //     return res.data;
  //   } catch (err) {
  //     console.error('Login error:', err.response?.data || err);

  //     dispatch({
  //       type: LOGIN_FAIL,
  //       payload: err.response?.data?.message || "Login failed"
  //     });
  //     throw err;
  //   }
  // };
  const login = async (email, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true // Ensure cookies are sent/received
    };

    try {
      console.log('Attempting login with credentials...');
      const res = await axios.post(
        `/auth/login`,
        { email, password },
        config
      );

      console.log('Login response received:', res.data);

      // Check if token is in the response
      if (res.data.token) {
        // Store token in localStorage as a backup
        localStorage.setItem('authToken', res.data.token);

        // Set Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        console.log('Token stored in localStorage and set in axios headers');
      } else {
        console.log('No token in response - relying on cookies');
      }

      // Dispatch login success with user data
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: res.data.token,
          user: res.data.user
        }
      });

      // Load user after successful login
      try {
        await loadUser();
      } catch (userError) {
        console.error('Error loading user after login:', userError);
        // Continue anyway - we're already logged in
      }

      return res.data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err);

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
      },
      withCredentials: true // Ensure cookies are sent/received
    };

    try {
      console.log('Attempting social login with:', userData.provider);
      const res = await axios.post(
        `/social/social-login`,
        userData,
        config
      );

      console.log('Social login response received:', res.data);

      // Check if additional verification is needed
      if (res.data.needsPhoneVerification) {
        console.log('Phone verification needed for social login');
        return res.data; // Return data for phone verification
      }

      // Check if token is in the response
      if (res.data.token) {
        // Store token in localStorage as a backup
        localStorage.setItem('authToken', res.data.token);

        // Set Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        console.log('Social login token stored in localStorage and set in axios headers');
      } else {
        console.log('No token in social login response - relying on cookies');
      }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: res.data.token,
          user: res.data.user
        }
      });

      try {
        await loadUser();
      } catch (userError) {
        console.error('Error loading user after social login:', userError);
        // Continue anyway - we're already logged in
      }

      return res.data;
    } catch (err) {
      console.error('Social login error:', err.response?.data || err);

      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.message || "Social login failed"
      });
      throw err;
    }
  };

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(`/auth/register`, formData, config);
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "Registration failed"
      });
      throw err;
    }
  };

  // Verify OTP and Complete Registration
  const verifyOTPAndRegister = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(`/auth/verify-otp`, data, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      await loadUser();
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "OTP verification failed"
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
      await axios.post(`/auth/logout`);

      dispatch({ type: LOGOUT });
    } catch (err) {
      console.error("Logout error:", err);
      dispatch({ type: LOGOUT });
    }
  };

  // Forgot Password
  const forgotPassword = async (emailOrPhone) => {
    try {
      const res = await axios.post(`/auth/forgotPassword`, { emailOrPhone });
      return res.data;
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: err.response?.data?.message || "Password reset request failed"
      });
      throw err;
    }
  };


  const getItNow = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(`/auth/get-it-now`, formData, config);



      dispatch({
        type: RESOURCE_SIGNUP_SUCCESS,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: RESOURCE_SIGNUP_FAIL,
        payload: err.response?.data?.message || "Resource signup failed"
      });
      throw err;
    }
  };

  // Clean up socket connection when component unmounts
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, []);

  // Complete social registration with OTP verification
  const completeSocialRegistration = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(`/social/complete-registration`, data, config);

      dispatch({
        type: LOGIN_SUCCESS
      });

      await loadUser();
      return res.data;
    } catch (err) {
      console.error('Social registration completion error:', err.response?.data || err);

      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || "Failed to complete registration"
      });
      throw err;
    }
  };

  // Resend OTP for Google phone verification
  const resendGooglePhoneOTP = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(`/social/resend-phone-otp`, data, config);
      return res.data;
    } catch (err) {
      console.error('Resend OTP error:', err.response?.data || err);
      throw err;
    }
  };

  // Resend OTP for regular registration
  const resendOTP = async (data) => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    try {
      const res = await axios.post(`/auth/resend-otp`, data, config);
      return res.data;
    } catch (err) {
      console.error('Resend OTP error:', err.response?.data || err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        socket: state.socket,
        onlineUsers: state.onlineUsers,
        languages,

        // Methods
        fetchAllLanguages,
        register,
        login,
        socialLogin,
        verifyOTPAndRegister,
        completeSocialRegistration,
        resendGooglePhoneOTP,
        resendOTP,
        logout,
        loadUser,
        clearErrors: () => dispatch({ type: CLEAR_ERRORS }),
        forgotPassword,
        getItNow,

        // Additional methods can be added here
        sendPrivateMessage: (recipientId, message) => {
          if (state.socket && state.isAuthenticated) {
            state.socket.emit("privateMessage", { recipientId, message });
            return true;
          }
          return false;
        }
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;