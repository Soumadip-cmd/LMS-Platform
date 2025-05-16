import axios from 'axios';
import { SERVER_URI } from '../utlils/ServerUri';
import { toast } from 'react-hot-toast';

// Create a configured instance of axios
const apiClient = axios.create({
  baseURL: SERVER_URI,
  withCredentials: true, // Always send cookies with requests
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  },
  // Retry configuration
  retry: 2, // Number of retry attempts
  retryDelay: 1000 // Delay between retries in ms
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from cookie if available
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is a network error or 5xx server error and we haven't retried yet
    if ((error.message.includes('Network Error') ||
        (error.response && error.response.status >= 500)) &&
        originalRequest.retry > 0) {

      originalRequest.retry -= 1;

      // Wait for the retry delay
      await new Promise(resolve => setTimeout(resolve, originalRequest.retryDelay));

      // Try the request again
      return apiClient(originalRequest);
    }

    // Handle CORS errors
    if (error.message.includes('Network Error') && !error.response) {
      console.error('CORS or network error detected');
      toast.error('Network connection error. Please try again later.');
    }

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear auth tokens
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/auth/login')) {
        toast.error('Your session has expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      }
    }

    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Setup:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
