import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      !originalRequest ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");

        return api(originalRequest);
      } catch (err) {
        const currentPath = window.location.pathname;

        const publicPaths = [
          "/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/flowers",
          "/ai-assistant",
        ];

        const isPublicPath = publicPaths.some((path) =>
          path === "/" ? currentPath === "/" : currentPath.startsWith(path),
        );

        if (!isPublicPath) {
          window.location.replace("/login");
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
