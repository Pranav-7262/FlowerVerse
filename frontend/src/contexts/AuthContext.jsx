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
      console.log("user : ", res.data.data.user);
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
      setUser(res.data.data.user); // cookies already set in response
      return res.data;
    } catch (err) {
      setUser(null);
      throw err;
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
  const getUserReviews = async () => {
    try {
      const res = await api.get("/auth/get-reviews");

      return res.data;
    } catch (error) {
      console.error("getUserReviews failed:", error?.message);
    }
  };
  const updatePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const res = await api.put("/auth/update-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });
      return res.data;
    } catch (error) {
      console.error("updatePassword failed:", error?.response?.data?.message);
      throw error;
    }
  };
  const updateUsername = async (userName) => {
    try {
      const res = await api.put("/auth/update-username", { userName });
      if (res.data?.data) setUser(res.data.data);
      return res.data;
    } catch (error) {
      console.error("updateUsername failed:", error?.message);
    }
  };

  const updateEmail = async (email) => {
    try {
      const res = await api.put("/auth/update-email", { email });
      if (res.data?.data) setUser(res.data.data);
      return res.data;
    } catch (error) {
      onsole.error("updateEmail failed:", error?.message);
    }
  };
  const resetAccount = async () => {
    try {
      const res = await api.delete("/auth/reset-account");
      return res.data;
    } catch (error) {
      console.error("resetAccount failed:", error?.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updatePassword,
        resetAccount,
        updateUsername,
        updateEmail,
        getUserReviews,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
