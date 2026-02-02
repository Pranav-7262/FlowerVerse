import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app startup
  const loadUser = async () => {
    try {
      const res = await api.get("/auth/current-user"); // cookies sent auto
      console.log("data : ", res.data.data.user);
      setUser(res.data.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("login user : ", res.data.data.user);
      setUser(res.data.data.user); // cookies already set in response
      return res.data;
    } catch (err) {
      setUser(null);
      console.log("error in login context :", err?.message);
    }
  };

  const register = async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      return res.data;
    } catch (error) {
      console.log("error in register context :", error?.message);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout"); // clears cookies
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
    }
  };
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      await api.put("/auth/update-password", { oldPassword, newPassword });
    } catch (error) {
      console.error("updatePassword failed:", error?.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// App Load
//   ├─ loadUser() runs ONCE (useRef protection)
//   ├─ Try GET /current-user
//   ├─ If 401 → POST /refresh (interceptor handles auto-refresh too)
//   ├─ Set accessToken in state & headers
//   ├─ Retry GET /current-user
//   └─ setLoading(false) → App renders

// User Login
//   ├─ POST /login → get token
//   ├─ Set state & headers
//   └─ Ready for protected routes

// User Logout
//   ├─ POST /logout
//   ├─ Clear state & headers
//   └─ Redirect to login
