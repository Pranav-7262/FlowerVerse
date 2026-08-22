import axios from "axios";

const storedAccessToken = sessionStorage.getItem("accessToken");

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

if (storedAccessToken) {
  api.defaults.headers.common.Authorization = `Bearer ${storedAccessToken}`;
}

api.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
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
        const accessToken = response.data?.data?.accessToken;
        if (accessToken) {
          sessionStorage.setItem("accessToken", accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }
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
