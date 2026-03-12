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
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] h-20 flex items-center">
      <div
        className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between"
        ref={dropdownRef}
      >
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-200 group-hover:bg-emerald-700 transition-colors"
          >
            <Flower className="text-white" size={24} />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-black text-gray-900 tracking-tighter leading-none">
              FlowerMart
            </span>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em] mt-1">
              Boutique
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1 md:gap-3">
          {user ? (
            <>
              {/* 1. SEPARATE ORDERS ITEM (Amazon Style) */}
              <Link
                to="/orders"
                className={`hidden sm:flex flex-col items-start px-4 py-2 rounded-2xl transition-all border border-transparent ${
                  location.pathname === "/orders"
                    ? "bg-emerald-50 border-emerald-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
                  Returns
                </span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
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
                      ? "bg-gray-100/50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none mb-1">
                    Hi, {user?.userName?.split(" ")[0]}
                  </span>
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
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
                      className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] py-4 z-50 overflow-hidden"
                    >
                      <Link
                        to="/account"
                        className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <User size={18} /> Profile Details
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 mt-2 border-t border-gray-50"
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
                  className={`hidden lg:flex flex-col items-start px-4 py-2 rounded-2xl transition-all border border-transparent ${
                    location.pathname === "/admin/dashboard"
                      ? "bg-amber-50 border-amber-100 shadow-sm shadow-amber-100"
                      : "hover:bg-amber-50/50"
                  }`}
                >
                  <span className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em] leading-none mb-1 flex items-center gap-1">
                    <ShieldCheck size={10} /> Management
                  </span>
                  <span className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                    Admin Dashboard
                  </span>
                </Link>
              )}

              {/* 4. CART (The Primary Action) */}
              <Link
                to="/cart"
                className="group relative flex items-center gap-3 ml-2 px-5 py-3 bg-gray-900 text-white rounded-2xl hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-gray-200"
              >
                <ShoppingBag size={20} />
                <div className="flex flex-col items-start mr-1">
                  <span className="text-[9px] font-black text-emerald-400 uppercase leading-none mb-0.5">
                    My Bag
                  </span>
                  <span className="text-xs font-bold">Items</span>
                </div>
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
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
