import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoutes";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlowerDetails from "./pages/FlowerDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import MyFlowers from "./pages/MyFlowers";
import Checkout from "./pages/Checkout";
import CreateFlower from "./pages/CreateFlower";
import EditFlower from "./pages/EditFlower";
import Account from "./pages/Account";
import Security from "./pages/Security";

const App = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-emerald-50 text-gray-800 flex flex-col">
      {/* Navbar stays full-width */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            border: "1px solid #713200",
            padding: "19px",

            borderRadius: "10px",
            fontSize: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#ecfdf5",
            },
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fee2e2",
            },
          },
        }}
      />
      <Navbar />

      {/* Page container - grows to fill space */}
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
              <ProtectedRoute>
                <CreateFlower />
              </ProtectedRoute>
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
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-flowers"
            element={
              <ProtectedRoute>
                <MyFlowers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flowers/edit/:flowerId"
            element={
              <ProtectedRoute>
                <EditFlower />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
