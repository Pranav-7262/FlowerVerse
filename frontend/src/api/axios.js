import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

let refreshPromise = null;
let refreshFailed = false;

const refreshAccessToken = () => {
  if (refreshFailed) {
    return Promise.reject(new Error("Authentication session expired"));
  }

  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;

        if (accessToken) {
          sessionStorage.setItem("accessToken", accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }

        return response;
      })
      .catch((error) => {
        refreshFailed = true;
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes("/auth/login")) {
      refreshFailed = false;
    }

    return response;
  },

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
        await refreshAccessToken();

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
