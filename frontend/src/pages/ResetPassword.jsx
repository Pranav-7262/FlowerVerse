import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const ResetPassword = () => {
  const { token } = useParams(); // like /reset-password/:token
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
    <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-100 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6">
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
          className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Confirm New Password"
          value={confirmPassword}
          disabled={loading}
          className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          disabled={
            loading ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
          className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Updating..."
            : user
              ? "Update Password"
              : "Reset Password"}
        </button>
      </form>
      <p className="text-center text-gray-500 text-xs mt-4">
        Remember your password?{" "}
        <a href="/login" className="text-emerald-600 font-bold hover:underline">
          Go to login
        </a>
      </p>
    </div>
  );
};

export default ResetPassword;
