import React from "react";
import { Users, Flower, Plus, ShoppingBag } from "lucide-react"; // Added ShoppingBag
import { useNavigate } from "react-router-dom";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="flex border-b border-slate-700 bg-slate-800/30 overflow-x-auto whitespace-nowrap">
      <button
        onClick={() => setActiveTab("users")}
        className={`flex-1 px-6 py-5 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative group ${
          activeTab === "users"
            ? "text-blue-400 bg-blue-600/10"
            : "text-gray-400 hover:text-gray-300"
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
            ? "text-pink-400 bg-pink-600/10"
            : "text-gray-400 hover:text-gray-300"
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
            ? "text-emerald-400 bg-emerald-600/10"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <ShoppingBag size={18} />
        Orders
        {activeTab === "orders" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
        )}
      </button>

      <button
        onClick={() => navigate("/flowers/create-flower")}
        className="px-8 py-5 text-xs font-black uppercase tracking-widest flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all border-l border-slate-200"
      >
        <Plus size={18} className="bg-emerald-100 rounded-full p-0.5" />
        New Flower
      </button>
    </div>
  );
};

export default TabNavigation;
