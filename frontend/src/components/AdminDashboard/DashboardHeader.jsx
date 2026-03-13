import React from "react";
import { BarChart3 } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="bg-linear-to-r from-slate-900 via-blue-900 to-emerald-900 shadow-lg border-b border-emerald-700/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-emerald-500/20 rounded-xl backdrop-blur-sm">
            <BarChart3 className="w-8 h-8 text-emerald-300" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-emerald-100/80 mt-2 font-medium">
          System Management & Analytics
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
