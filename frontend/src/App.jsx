import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoutes";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlowerDetails from "./pages/FlowerDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";

import Checkout from "./pages/Checkout";
import CreateFlower from "./pages/CreateFlower";
import EditFlower from "./pages/EditFlower";
import Account from "./pages/Account";
import Security from "./pages/Security";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import RemoveAccount from "./pages/RemoveAccount";
import Address from "./pages/Address";

import Support from "./pages/Support";

const App = () => {
  return (
    <div className="min-h-screen  from-amber-50 via-rose-50 to-pink-50 text-slate-800  flex flex-col selection:bg-rose-200/50">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#0f172a", // Slate-900
            color: "#f8fafc",
            border: "1px solid rgba(16, 185, 129, 0.2)", // Subtle Emerald
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#0f172a" },
          },
        }}
      />

      <Navbar />

      <main className="flex-1 w-full">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/flowers/:flowerId" element={<FlowerDetails />} />

          {/* Protected */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/security"
            element={
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flowers/create-flower"
            element={
              <AdminRoute>
                <CreateFlower />
              </AdminRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/addresses"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/remove-acc"
            element={
              <ProtectedRoute>
                <RemoveAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />

          <Route
            path="/flowers/edit/:flowerId"
            element={
              <AdminRoute>
                <EditFlower />
              </AdminRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
