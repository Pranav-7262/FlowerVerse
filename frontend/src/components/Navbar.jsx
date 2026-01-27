import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-green-600 font-semibold"
      : "text-gray-700 hover:text-green-600 transition";

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          🌸 FlowerMart
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>

          {user && (
            <>
              <NavLink to="/cart" className={navLinkClass}>
                Cart
              </NavLink>

              <NavLink to="/my-flowers" className={navLinkClass}>
                My Flowers
              </NavLink>
            </>
          )}
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Hi, <span className="font-semibold">{user?.userName}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg border border-green-600 text-green-600 hover:bg-green-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/cart"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Cart
              </NavLink>
              <NavLink
                to="/orders"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Orders
              </NavLink>
              <NavLink
                to="/my-flowers"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                My Flowers
              </NavLink>
              <button
                onClick={logout}
                className="block w-full text-left text-red-600 font-semibold"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
