import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FlowerDetails from "./pages/FlowerDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import MyFlowers from "./pages/MyFlowers";
import Checkout from "./pages/Checkout";
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-emerald-50 text-gray-800 flex flex-col">
        {/* Navbar stays full-width */}
        <Navbar />

        {/* Page container - grows to fill space */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flowers/:id" element={<FlowerDetails />} />

            {/* Protected */}
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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
