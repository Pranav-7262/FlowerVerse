import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-rose-50 to-pink-50 text-slate-800 flex flex-col selection:bg-rose-200/50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content - Outlet renders the page content here */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
