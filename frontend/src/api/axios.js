import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    // Content-Type removed — Axios sets this automatically per-request
    // (application/json for plain objects, multipart/form-data for FormData)
    // 'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       // Handle 401 Unauthorized
//       if (error.response.status === 401) {
//         sessionStorage.removeItem('auth_token');
//         sessionStorage.removeItem('user');
//         window.location.href = '/login';
//       }
      
//       // Handle 403 Forbidden
//       if (error.response.status === 403) {
//         alert('You do not have permission to perform this action.');
//       }
      
//       // Handle 404 Not Found
//       if (error.response.status === 404) {
//         // Redirect to 404 page or show message
//         window.location.href = '/404';
//       }
      
//       // Handle 500 Server Error
//       if (error.response.status === 500) {
//         alert('Server error. Please try again later.');
//       }
//     }
//     return Promise.reject(error);
//   }
// );
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user');

        // Only redirect if we're not already on the login/register page,
        // and use a soft redirect so we don't force a full reload loop
        const publicPaths = ['/login', '/register'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
      if (error.response.status === 403) {
        alert('You do not have permission to perform this action.');
      }
      if (error.response.status === 404) {
        // Don't hard-redirect here either — this is likely also contributing
        // window.location.href = '/404';
      }
      if (error.response.status === 500) {
        alert('Server error. Please try again later.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;