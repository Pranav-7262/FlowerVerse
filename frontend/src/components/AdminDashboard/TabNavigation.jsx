import React from "react";
import { Users, Flower, Plus, ShoppingBag } from "lucide-react"; // Added ShoppingBag
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
      className="flex border-b border-rose-200/50 bg-white/30 overflow-x-auto whitespace-nowrap"
    >
      <button
        onClick={() => setActiveTab("users")}
        className={`flex-1 px-6 py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative group ${
          activeTab === "users"
            ? "text-blue-600 bg-blue-100/50"
            : "text-slate-600 hover:text-slate-700"
        }`}
      >
        <Users size={18} />
        Users
        {activeTab === "users" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        )}
      </button>

      <button
        onClick={() => setActiveTab("flowers")}
        className={`flex-1 px-6 py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative group ${
          activeTab === "flowers"
            ? "text-pink-600 bg-pink-100/50"
            : "text-slate-600 hover:text-slate-700"
        }`}
      >
        <Flower size={18} />
        Flowers
        {activeTab === "flowers" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500" />
        )}
      </button>

      <button
        onClick={() => setActiveTab("orders")}
        className={`flex-1 px-6 py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative group ${
          activeTab === "orders"
            ? "text-rose-600 bg-rose-100/50"
            : "text-slate-600 hover:text-slate-700"
        }`}
      >
        <ShoppingBag size={18} />
        Orders
        {activeTab === "orders" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600" />
        )}
      </button>

      <button
        onClick={() => navigate("/flowers/create-flower")}
        className="px-8 py-5 text-xs font-black uppercase tracking-widest flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition-all border-l border-rose-200/50"
      >
        <Plus size={18} className="bg-rose-100 rounded-full p-0.5" />
        New Flower
      </button>
    </motion.div>
  );
};

export default TabNavigation;
