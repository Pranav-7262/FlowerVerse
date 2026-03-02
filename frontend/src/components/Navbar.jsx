import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  Flower,
  ShoppingBag,
  LogOut,
  Package,
  User,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdowns on click outside
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

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 },
  };

  // fetch cart whenever user or location changes
  useEffect(() => {
    fetchCart();
  }, [location.pathname, user]);

  // update cart count on custom event (backup)
  useEffect(() => {
    const handler = () => fetchCart();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, [fetchCart]);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-20 flex items-center">
      <div
        className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between"
        ref={dropdownRef}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Flower className="text-white" size={22} />
          </div>
          <span className="text-2xl font-serif font-black text-emerald-950">
            FlowerMart
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* 1. Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "account" ? null : "account",
                    )
                  }
                  className={`flex flex-col items-start px-4 py-1.5 rounded-xl transition-all ${activeDropdown === "account" ? "bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none mb-1">
                    {user?.userName}
                  </span>

                  <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                    Your Account{" "}
                    <ChevronDown
                      size={14}
                      className={
                        activeDropdown === "account" ? "rotate-180" : ""
                      }
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
                      className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl py-3 z-50"
                    >
                      <Link
                        to="/account"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <User size={18} /> Profile Details
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Package size={18} /> Your Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 mt-2 border-t border-gray-50 pt-3"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Seller Central Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "seller" ? null : "seller",
                    )
                  }
                  className={`flex flex-col items-start px-4 py-1.5 rounded-xl transition-all ${activeDropdown === "seller" ? "bg-emerald-50" : "hover:bg-emerald-50"}`}
                >
                  <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none mb-1">
                    Business
                  </span>
                  <span className="text-sm font-bold text-emerald-900 flex items-center gap-1">
                    Seller Central{" "}
                    <ChevronDown
                      size={14}
                      className={
                        activeDropdown === "seller" ? "rotate-180" : ""
                      }
                    />
                  </span>
                </button>

                <AnimatePresence>
                  {activeDropdown === "seller" && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-3 w-56 bg-white border border-emerald-100 shadow-2xl rounded-2xl py-3 z-50"
                    >
                      <Link
                        to="/my-flowers"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <LayoutDashboard size={18} /> Seller Studio
                      </Link>
                      <Link
                        to="/flowers/create-flower"
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <PlusCircle size={18} /> List New Flower
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Separate Orders Item (Amazon style) */}
              <Link
                to="/orders"
                className="hidden md:flex flex-col items-start px-4 py-1.5 hover:bg-gray-50 rounded-xl transition-all"
              >
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
                  Sales
                </span>
                <span className="text-sm font-bold text-gray-900">
                  & Orders
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center gap-2 ml-2 p-3 bg-gray-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-gray-200"
              >
                <ShoppingBag size={20} />
                <span className="font-bold text-sm hidden lg:block">Cart</span>
                <span className="bg-emerald-500 text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border border-gray-900">
                  {cartCount}
                </span>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-gray-600">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
