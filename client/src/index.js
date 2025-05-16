import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import { SERVER_URI } from './utlils/ServerUri';
import reportWebVitals from './reportWebVitals';

// Configure axios defaults
axios.defaults.baseURL = SERVER_URI;
axios.defaults.withCredentials = true;

// Check for token in localStorage and set Authorization header
const token = localStorage.getItem('authToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log('Token found in localStorage, setting Authorization header');
} else {
  console.log('No token found in localStorage');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
