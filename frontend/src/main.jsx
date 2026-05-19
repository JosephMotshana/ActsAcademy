// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

 import React from 'react';
 import ReactDOM from 'react-dom/client';
import axios from 'axios';
 import App from './App';
 import { BrowserRouter } from 'react-router-dom'; // 1. Import this


// Configure global axios base URL from Vite env or use relative paths in production
const API_URL = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = API_URL || '';
// Expose to window for non-axios uses (links, fetch, etc.)
window.__API_URL__ = API_URL || '';

// Interceptor: rewrite any hardcoded localhost:5000 requests to the configured API URL
axios.interceptors.request.use((config) => {
   try {
      if (config && config.url) {
         if (config.url.startsWith('http://localhost:5000')) {
            config.url = config.url.replace('http://localhost:5000', API_URL || '');
         } else if (config.url.startsWith('https://localhost:5000')) {
            config.url = config.url.replace('https://localhost:5000', API_URL || '');
         }
      }
   } catch (e) {
      // ignore
   }
   return config;
}, (error) => Promise.reject(error));

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
      <BrowserRouter> {/* 2. Wrap your App here */}
          <App />
      </BrowserRouter>
   </React.StrictMode>
);