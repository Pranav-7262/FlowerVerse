import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleRequest = async (e) => {
    e.preventDefault();

    if (!Email || !Email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      // include leading slash to use baseURL correctly
      const res = await api.post("/auth/forgot-password", { email: Email });
      setIsSent(true);
      toast.success("Check your email for the reset link! 📧");
      setEmail("");

      // in dev, also show the link for testing
      if (res.data?.data?.resetUrl) {
        console.log("Development: Reset link:", res.data.data.resetUrl);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl border border-gray-100 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Forgot Password?</h2>
      <p className="text-gray-500 text-sm mb-6">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleRequest} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={Email}
          disabled={loading}
          className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading || !Email}
          className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
