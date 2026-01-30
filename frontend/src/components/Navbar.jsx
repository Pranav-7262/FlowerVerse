import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Flower,
  ShoppingBag,
  User,
  LogOut,
  Tag,
  X,
  Menu,
  Package,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [location]);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
    }`;
  const handleLogout = async () => {
    if (!window.confirm("Are you Sure to Logging Out ?")) {
      return;
    }
    await logout();
    toast.success("Logged Out Successful !");
    navigate("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                <Flower className="text-white" size={24} />
              </div>
              <span className="text-xl font-serif font-bold bg-linear-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
                FlowerMart
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink to="/orders" className={navLinkClass}>
                  <Package size={18} /> Orders
                </NavLink>
                <NavLink to="/my-flowers" className={navLinkClass}>
                  <LayoutDashboard size={18} /> My Flowers
                </NavLink>
                <NavLink to="/cart" className={navLinkClass}>
                  <div className="relative">
                    <ShoppingBag size={18} />
                    {/* Potential Badge: <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
                  </div>
                  Cart
                </NavLink>
                <NavLink to="/flowers/create-flower" className={navLinkClass}>
                  <Tag size={20} /> Sell
                </NavLink>

                <div className="h-6 w-px bg-gray-200 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Welcome
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {user?.userName}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-gray-50 text-gray-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-4 shadow-xl">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>
              <NavLink to="/my-flowers" className={navLinkClass}>
                My Flowers
              </NavLink>
              <NavLink to="/cart" className={navLinkClass}>
                Cart
              </NavLink>
              <NavLink to="/flowers/create-flower" className={navLinkClass}>
                Sell
              </NavLink>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-gray-700">
                  {user?.userName}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 font-bold"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link
                to="/login"
                className="flex items-center justify-center py-3 border border-gray-200 rounded-xl font-bold text-gray-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center py-3 bg-emerald-600 rounded-xl font-bold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
