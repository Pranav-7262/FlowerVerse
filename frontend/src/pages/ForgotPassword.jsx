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
    <div className="max-w-md mx-auto mt-20 p-8 bg-white/70 rounded-2xl border border-rose-200/50 shadow-xl backdrop-blur-sm min-h-[calc(100vh-64px)] flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">
        Forgot Password?
      </h2>
      <p className="text-slate-600 text-sm mb-6">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleRequest} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={Email}
          disabled={loading}
          className="w-full p-3 border border-rose-200/50 rounded-xl outline-none focus:ring-2 focus:ring-rose-600/50 disabled:bg-rose-100/30 bg-white/50 text-slate-900 placeholder:text-slate-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading || !Email}
          className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-rose-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
