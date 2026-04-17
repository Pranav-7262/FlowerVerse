import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, they might want to change password instead
  useEffect(() => {
    if (user) {
      toast.info(
        "You're already logged in. This will update your current password.",
      );
    }
  }, [user]);

  const handleReset = async (e) => {
    e.preventDefault();

    // Validate password
    if (!password || password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password }); // send new password to backend along with token
      toast.success("Password updated successfully! 🎉");

      // If user was logged in, log them out since password changed
      if (user) {
        await logout();
        toast.info("Please login with your new password");
      }

      setTimeout(() => navigate("/login"), 2000); // delay to let toast show
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Link expired or invalid";
      toast.error(errorMsg);

      // If token is invalid/expired, redirect to forgot password
      if (error.response?.status === 400) {
        setTimeout(() => navigate("/forgot-password"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white/70 border border-rose-200/50 rounded-2xl shadow-xl backdrop-blur-sm min-h-[calc(100vh-64px)] flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">
        {user ? "Change Your Password" : "Create New Password"}
      </h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="password"
          required
          minLength={6}
          placeholder="New Password (min. 6 characters)"
          value={password}
          disabled={loading}
          className="w-full p-3 border border-rose-200/50 rounded-xl outline-none focus:ring-2 focus:ring-rose-600/50 disabled:bg-rose-100/30 bg-white/50 text-slate-900 placeholder:text-slate-400"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Confirm New Password"
          value={confirmPassword}
          disabled={loading}
          className="w-full p-3 border border-rose-200/50 rounded-xl outline-none focus:ring-2 focus:ring-rose-600/50 disabled:bg-rose-100/30 bg-white/50 text-slate-900 placeholder:text-slate-400"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          disabled={
            loading ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
          className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading
            ? "Updating..."
            : user
              ? "Update Password"
              : "Reset Password"}
        </button>
      </form>
      <p className="text-center text-slate-600 text-xs mt-4">
        Remember your password?{" "}
        <a href="/login" className="text-rose-600 font-bold hover:underline">
          Go to login
        </a>
      </p>
    </div>
  );
};

export default ResetPassword;
