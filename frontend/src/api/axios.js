import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // required for refresh cookie
});

// Flag to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshRes.data.data.accessToken;

        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;

// User makes request with expired token
//         ↓
// 401 Error returned
//         ↓
// Is already refreshing?
//     ├─ YES → Queue this request, wait for refresh
//     └─ NO  → Start refresh
//         ↓
// Call /auth/refresh with httpOnly cookie
//         ↓
// Get new access token
//         ↓
// Update Authorization header
//         ↓
// Process queue (retry all queued requests)
//         ↓
// Retry original request with new token
//         ↓
// Success! ✅
