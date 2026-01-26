import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Load user on app startup (without refreshing token)
  const loadUser = async () => {
    try {
      const res = await api.get("/auth/current-user");
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
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.data.accessToken;

    setAccessToken(token);
    setUser(res.data.data.user);

    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    setUser(res.data.data);

    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        accessToken,
        login,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// 1. App loads → AuthContext calls loadUser() → Gets current user (no refresh)
// 2. User logs in → Sets user + accessToken in state
// 3. Request made → If 401 → axios interceptor catches it
// 4. Interceptor refreshes token using httpOnly cookie
// 5. Request retried with new token → User stays logged in
// 6. User logs out → Clears state + calls logout endpoint
