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
    <div className="px-6 py-5 border-t border-rose-200/50 flex items-center justify-between bg-gradient-to-r from-white/50 to-transparent">
      <div className="text-sm font-medium text-slate-600">
        Page{" "}
        <span className="font-bold text-white bg-rose-600/20 border border-rose-600/40 px-2 py-1 rounded-lg ml-1 mr-1">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-bold text-slate-900 bg-white/50 border border-rose-200/50 px-2 py-1 rounded-lg ml-1">
          {totalPages}
        </span>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onPreviousClick}
          disabled={currentPage === 1}
          className="px-4 py-2.5 border border-rose-200/50 rounded-lg text-sm font-bold hover:bg-white/50 hover:border-rose-300/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all bg-white/30 text-slate-700 shadow-sm hover:shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={onNextClick}
          disabled={currentPage === totalPages}
          className="px-4 py-2.5 border border-rose-200/50 rounded-lg text-sm font-bold hover:bg-white/50 hover:border-rose-300/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-all bg-white/30 text-slate-700 shadow-sm hover:shadow-md"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
