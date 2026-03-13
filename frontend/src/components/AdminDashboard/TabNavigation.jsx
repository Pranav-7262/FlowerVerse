import React from "react";
import { Users, Flower, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TabNavigation = ({ activeTab, setActiveTab, onAddFlower }) => {
  const navigate = useNavigate();

  return (
    <div className="flex border-b border-slate-200 bg-slate-50/50">
      <button
        onClick={() => {
          setActiveTab("users");
        }}
        className={`flex-1 px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative group ${
          activeTab === "users"
            ? "text-blue-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <Users size={18} />
        User Management
        {activeTab === "users" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600" />
        )}
      </button>
      <button
        onClick={() => setActiveTab("flowers")}
        className={`flex-1 px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all relative group ${
          activeTab === "flowers"
            ? "text-pink-600"
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <Flower size={18} />
        Flower Management
        {activeTab === "flowers" && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-pink-500 to-pink-600" />
        )}
      </button>
      <button
        onClick={() => navigate("/flowers/create-flower")}
        className="px-6 py-4 text-sm font-bold flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 transition-all border-l border-slate-200 hover:text-emerald-700"
      >
        <Plus size={18} />
        Add New Flower
      </button>
    </div>
  );
};

export default TabNavigation;
