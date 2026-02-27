import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if it's a refresh token request or if we've already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh-token')) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh-token');
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed
        // Only redirect if we are NOT already on the login or register page
        // And if the failed request was NOT the initial auth check (which handles its own error)
        const isAuthCheck = originalRequest.url?.includes('/auth/me');
        const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
        
        if (!isAuthCheck && !isAuthPage) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
