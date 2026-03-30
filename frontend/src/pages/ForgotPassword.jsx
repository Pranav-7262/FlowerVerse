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
    <div className="max-w-md mx-auto mt-20 p-8 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-xl min-h-[calc(100vh-64px)] flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Forgot Password?
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleRequest} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={Email}
          disabled={loading}
          className="w-full p-3 border border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600/50 disabled:bg-slate-700/50 bg-slate-700/50 text-gray-100 placeholder:text-gray-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading || !Email}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
