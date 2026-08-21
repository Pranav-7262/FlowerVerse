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
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Log out of FlowerrMart?")) return;
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

  const desktopActionClass = (isActive, baseClasses = "") =>
    `flex flex-col items-start rounded-2xl border px-4 py-2.5 whitespace-nowrap transition-all ${
      isActive
        ? "border-rose-500/50 bg-rose-600/20 text-rose-700 shadow-sm"
        : `${baseClasses} border-transparent text-slate-600 hover:bg-rose-100/50 hover:text-slate-900`
    }`;

  const mobileLinkClass = (isActive, baseClasses = "") =>
    `flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? "border-rose-400/70 bg-rose-50 text-rose-700"
        : `${baseClasses} border-rose-100 bg-white/80 text-slate-700 hover:border-rose-300 hover:bg-rose-50`
    }`;

  return (
    <nav className="sticky top-0 z-100 border-b border-rose-100/50 bg-linear-to-r from-white via-rose-50 to-pink-50 shadow-md shadow-rose-200/30 backdrop-blur-md">
      <div
        className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3 sm:px-6 lg:px-8 xl:px-10"
        ref={dropdownRef}
      >
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="rounded-2xl bg-linear-to-r from-rose-600 to-pink-600 p-2.5 shadow-lg shadow-rose-600/40 transition-all group-hover:shadow-lg group-hover:shadow-rose-600/60"
            >
              <Flower className="text-white" size={24} />
            </motion.div>
            <div className="flex flex-col">
              <span className="bg-linear-to-r from-rose-700 to-pink-600 bg-clip-text text-2xl font-serif font-black tracking-tighter text-transparent leading-none">
                FlowerrMart
              </span>
              <span className="mt-1 text-[9px] font-black uppercase tracking-[0.3em] text-rose-600">
                Boutique
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex md:gap-3 lg:gap-4 xl:gap-5">
              <Link
                to="/ai-assistant"
                className="flex shrink-0 items-center gap-2 rounded-2xl border border-rose-200 bg-white/90 px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-400 hover:text-rose-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-rose-600 to-pink-600 text-white">
                  <Flower size={16} />
                </div>
                <span>AI Assistant</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/orders"
                    className={desktopActionClass(
                      location.pathname === "/orders",
                    )}
                  >
                    <span className="mb-1 text-[10px] font-black uppercase tracking-widest leading-none">
                      Returns
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold">
                      & Orders
                    </span>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "account" ? null : "account",
                        )
                      }
                      className={`flex flex-col items-start rounded-2xl px-4 py-2 transition-all ${
                        activeDropdown === "account"
                          ? "bg-rose-100/50 text-rose-700"
                          : "text-slate-600 hover:bg-white/50 hover:text-slate-700"
                      }`}
                    >
                      <span className="mb-1 text-[10px] font-black uppercase tracking-widest leading-none">
                        Hi, {user?.userName?.split(" ")[0]}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold">
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
                          className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-4xl border border-rose-200/50 bg-white/90 py-4 shadow-lg shadow-rose-200/20 backdrop-blur-xl"
                        >
                          <Link
                            to="/account"
                            className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-rose-100/50 hover:text-rose-700"
                          >
                            <User size={18} /> Profile Details
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="mt-2 flex w-full items-center gap-3 border-t border-rose-200/30 px-6 py-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-100/50"
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
                      className={desktopActionClass(
                        location.pathname === "/admin/dashboard",
                        "hover:bg-white/50",
                      )}
                    >
                      <span className="mb-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] leading-none">
                        <ShieldCheck size={10} /> Management
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-bold">
                        Admin Dashboard
                      </span>
                    </Link>
                  )}

                  <Link
                    to="/cart"
                    className="group relative flex shrink-0 items-center gap-3 rounded-2xl bg-linear-to-r from-rose-600 to-pink-600 px-5 py-3 text-white shadow-lg shadow-rose-600/40 transition-all duration-300 hover:shadow-xl hover:shadow-rose-600/50"
                  >
                    <ShoppingBag size={20} />
                    <div className="mr-1 flex flex-col items-start">
                      <span className="mb-0.5 text-[9px] font-black uppercase leading-none text-rose-100">
                        My Bag
                      </span>
                      <span className="text-xs font-bold">Items</span>
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-pink-500 text-[10px] font-black text-white shadow-lg shadow-pink-500/50">
                      {cartCount}
                    </span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-sm font-black uppercase tracking-widest text-slate-600 transition-colors hover:text-rose-600"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-2xl bg-linear-to-r from-rose-600 to-pink-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-600/60"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-white/90 text-slate-700 shadow-sm transition hover:border-rose-400 hover:text-rose-700 md:hidden"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex flex-col gap-2 rounded-[1.75rem] border border-rose-200/60 bg-white/95 p-3 shadow-xl shadow-rose-200/40 md:hidden"
            >
              <Link
                to="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-rose-200 bg-linear-to-r from-rose-50 to-pink-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-rose-600 to-pink-600 text-white">
                    <Flower size={16} />
                  </div>
                  AI Assistant
                </span>
                <ChevronDown size={16} className="-rotate-90" />
              </Link>

              {user ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(location.pathname === "/orders")}
                  >
                    <span>Orders</span>
                    <ShoppingBag size={16} />
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(
                      location.pathname === "/account",
                    )}
                  >
                    <span>Account</span>
                    <User size={16} />
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass(
                        location.pathname === "/admin/dashboard",
                      )}
                    >
                      <span>Admin Dashboard</span>
                      <ShieldCheck size={16} />
                    </Link>
                  )}
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl bg-linear-to-r from-rose-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/40"
                  >
                    <span>View Cart</span>
                    <ShoppingBag size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
                  >
                    <span>Sign Out</span>
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl border border-rose-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl bg-linear-to-r from-rose-600 to-pink-600 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
