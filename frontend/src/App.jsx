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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-gray-100 flex flex-col">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            color: "#fff",
            border: "1.5px solid rgba(236, 72, 153, 0.3)",
            padding: "16px 24px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "500",
            letterSpacing: "0.3px",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(236, 72, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            animation: "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          },
          success: {
            style: {
              background:
                "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)",
              border: "1.5px solid rgba(34, 197, 94, 0.4)",
              color: "#fff",
              boxShadow:
                "0 20px 50px rgba(34, 197, 94, 0.2), 0 0 30px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "rgba(34, 197, 94, 0.2)",
            },
          },
          error: {
            style: {
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)",
              border: "1.5px solid rgba(239, 68, 68, 0.4)",
              color: "#fff",
              boxShadow:
                "0 20px 50px rgba(239, 68, 68, 0.2), 0 0 30px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "rgba(239, 68, 68, 0.2)",
            },
          },
          loading: {
            style: {
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)",
              border: "1.5px solid rgba(59, 130, 246, 0.4)",
              color: "#fff",
              boxShadow:
                "0 20px 50px rgba(59, 130, 246, 0.2), 0 0 30px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            },
            iconTheme: {
              primary: "#3b82f6",
              secondary: "rgba(59, 130, 246, 0.2)",
            },
          },
        }}
      />
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
