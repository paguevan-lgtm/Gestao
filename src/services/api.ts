import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookies
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/auth/refresh-token');
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
