// This file sets up our API client (axios)
// The most important part is the "interceptor" that automatically:
//   1. Adds the access token to every request
//   2. Refreshes the token silently when it expires (401 response)
//   3. Logs the user out if the refresh also fails

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create a custom axios instance with base URL pre-configured
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
// Runs before every outgoing request
// Automatically attaches the stored access token to the Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────
// Runs after every response comes back
// If we get a 401 (token expired), try to refresh silently
api.interceptors.response.use(
  (response) => response, // If response is fine, just return it

  async (error) => {
    const originalRequest = error.config;

    // 401 = unauthorized (token expired), and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark so we don't loop infinitely

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Try to get a new access token using the refresh token
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { accessToken } = response.data.data;

          // Store the new token
          localStorage.setItem('accessToken', accessToken);

          // Retry the original failed request with the new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch {
          // Refresh also failed — clear everything and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
