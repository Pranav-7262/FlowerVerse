import { useState } from "react";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Lock, UserPlus, Loader2, ArrowRight } from "lucide-react";

const Register = () => {
  const { register } = useAuth(); // Assuming your auth context has a register method
  const navigate = useNavigate();

  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        userName: form.userName,
        email: form.email,
        password: form.password,
      };

      await register(payload);
      toast.success("Registration successful ! Please login");

      // Redirect to login instead of home
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 bg-gray-50/50">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2">Join us and start shopping today</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* Name Field */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              required
              placeholder="Username"
              className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              onChange={(e) => setForm({ ...form, userName: e.target.value })}
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="password"
              required
              placeholder="Create Password"
              className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-2xl shadow-xl shadow-gray-200 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
