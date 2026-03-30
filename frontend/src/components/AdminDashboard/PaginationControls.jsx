import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({
  currentPage,
  totalPages,
  onPreviousClick,
  onNextClick,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-5 border-t border-slate-700 flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-transparent">
      <div className="text-sm font-medium text-gray-400">
        Page{" "}
        <span className="font-bold text-gray-200 bg-emerald-600/20 border border-emerald-600/40 px-2 py-1 rounded-lg ml-1 mr-1">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-bold text-gray-200 bg-slate-700/50 border border-slate-600 px-2 py-1 rounded-lg ml-1">
          {totalPages}
        </span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onPreviousClick}
          disabled={currentPage === 1}
          className="px-4 py-2.5 border border-slate-600 rounded-lg text-sm font-bold hover:bg-slate-700/50 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all bg-slate-800/30 text-gray-300 shadow-sm hover:shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={onNextClick}
          disabled={currentPage === totalPages}
          className="px-4 py-2.5 border border-slate-600 rounded-lg text-sm font-bold hover:bg-slate-700/50 hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all bg-slate-800/30 text-gray-300 shadow-sm hover:shadow-md"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
