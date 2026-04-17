import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  Flower,
  ShoppingBag,
  LogOut,
  User,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Log out of FlowerMart?")) return;
    await logout();
    toast.success("Logged out! 🌸");
    navigate("/login");
  };

  useEffect(() => {
    fetchCart();
  }, [location.pathname, user]);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 20, stiffness: 300 },
    },
    exit: { opacity: 0, y: 8, scale: 0.95 },
  };

  return (
    <nav className="bg-gradient-to-r from-white via-rose-50 to-pink-50 backdrop-blur-md border-b border-rose-100/50 sticky top-0 z-[100] h-20 flex items-center shadow-md shadow-rose-200/30">
      <div
        className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between"
        ref={dropdownRef}
      >
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="bg-gradient-to-r from-rose-600 to-pink-600 p-2.5 rounded-2xl shadow-lg shadow-rose-600/40 group-hover:shadow-lg group-hover:shadow-rose-600/60 transition-all"
          >
            <Flower className="text-white" size={24} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-pink-600 tracking-tighter leading-none">
              FlowerMart
            </span>
            <span className="text-[9px] font-black text-rose-600 uppercase tracking-[0.3em] mt-1">
              Boutique
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1 md:gap-3">
          {user ? (
            <>
              <Link
                to="/orders"
                className={`hidden sm:flex flex-col items-start px-4 py-2 rounded-2xl transition-all border ${
                  location.pathname === "/orders"
                    ? "bg-rose-600/20 border-rose-500/50 text-rose-700"
                    : "border-transparent hover:bg-rose-100/50 text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                  Returns
                </span>
                <span className="text-sm font-bold flex items-center gap-1.5">
                  & Orders
                </span>
              </Link>

              {/* 2. ACCOUNT DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "account" ? null : "account",
                    )
                  }
                  className={`flex flex-col items-start px-4 py-2 rounded-2xl transition-all ${
                    activeDropdown === "account"
                      ? "bg-rose-100/50 text-rose-700"
                      : "hover:bg-white/50 text-slate-600 hover:text-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                    Hi, {user?.userName?.split(" ")[0]}
                  </span>
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    Account{" "}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${activeDropdown === "account" ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>

                <AnimatePresence>
                  {activeDropdown === "account" && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl border border-rose-200/50 shadow-lg shadow-rose-200/20 rounded-[2rem] py-4 z-50 overflow-hidden"
                    >
                      <Link
                        to="/account"
                        className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-rose-100/50 hover:text-rose-700 transition-colors"
                      >
                        <User size={18} /> Profile Details
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-red-600 hover:bg-red-100/50 mt-2 border-t border-rose-200/30"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={`hidden lg:flex flex-col items-start px-4 py-2 rounded-2xl transition-all border ${
                    location.pathname === "/admin/dashboard"
                      ? "bg-amber-100/50 border-amber-300/50 text-amber-700"
                      : "border-transparent hover:bg-white/50 text-slate-600"
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1 flex items-center gap-1">
                    <ShieldCheck size={10} /> Management
                  </span>
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    Admin Dashboard
                  </span>
                </Link>
              )}

              {/* 4. CART (The Primary Action) */}
              <Link
                to="/cart"
                className="group relative flex items-center gap-3 ml-2 px-5 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl hover:shadow-xl hover:shadow-rose-600/50 transition-all duration-300 shadow-lg shadow-rose-600/40"
              >
                <ShoppingBag size={20} />
                <div className="flex flex-col items-start mr-1">
                  <span className="text-[9px] font-black text-rose-100 uppercase leading-none mb-0.5">
                    My Bag
                  </span>
                  <span className="text-xs font-bold">Items</span>
                </div>
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg shadow-pink-500/50">
                  {cartCount}
                </span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm font-black text-slate-600 hover:text-rose-600 uppercase tracking-widest transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-rose-600/40 hover:shadow-xl hover:shadow-rose-600/60 hover:-translate-y-0.5 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
