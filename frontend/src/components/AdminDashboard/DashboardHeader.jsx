import React from "react";
import { BarChart3 } from "lucide-react";

const DashboardHeader = () => {
  return (
    <div className="bg-gradient-to-r from-amber-100 via-rose-100 to-pink-100 shadow-lg border-b border-rose-200/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-rose-600/20 rounded-xl backdrop-blur-sm">
            <BarChart3 className="w-8 h-8 text-rose-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight drop-shadow-lg">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-slate-700 mt-2 font-medium">
          System Management & Analytics
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
