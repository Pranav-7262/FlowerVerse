import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Send refresh token cookie
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ Skip auth routes
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh"); // cookies auto sent
        return api(originalRequest);
      } catch (err) {
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
