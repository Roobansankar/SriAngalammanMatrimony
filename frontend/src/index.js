import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// Set a runtime API base available to all pages. Prefer REACT_APP_API_BASE if set at build time,
// otherwise fall back to the current origin so requests are same-origin.
// Force empty string to ensure we use relative paths and Nginx proxy
const runtimeApiBase = ""; 
window.__RESOLVED_API_BASE__ = window.location.origin;
console.log('Runtime API base:', window.__RESOLVED_API_BASE__);

// Ensure token (if present) is attached to all axios requests at startup to avoid missing token on first request
const token = localStorage.getItem('token');
if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Use the runtime-resolved API base as axios baseURL so relative requests resolve correctly
axios.defaults.baseURL = "";
console.log('axios baseURL set to relative path');


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
