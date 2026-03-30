import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login Successful !");
      navigate("/");
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-slate-800/50 rounded-2xl shadow-lg shadow-black/40 border border-slate-700 p-8 space-y-6 backdrop-blur-xl"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-100 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm">
            Please enter your details to sign in
          </p>
        </div>

        <div className="space-y-4">
          {/* Email Field */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-slate-700/50 border border-slate-600 p-3 pl-10 rounded-xl text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600 transition-all"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full bg-slate-700/50 border border-slate-600 p-3 pl-10 rounded-xl text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-emerald-600/50 focus:border-emerald-600 transition-all"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-1">
            <Link
              to="/forgot-password"
              size="sm"
              className="text-sm text-emerald-600 font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-600/40 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <span
            className="text-emerald-400 cursor-pointer hover:text-emerald-300 font-medium"
            onClick={() => navigate("/register")}
          >
            Create one
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
