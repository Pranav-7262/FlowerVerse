import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

const SortDropdown = ({
  options,
  activeSort,
  onSortChange,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-12 px-5 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg shadow-black/30 text-sm font-bold text-gray-200 hover:border-emerald-500/50 transition-all"
      >
        <span className="text-gray-500 font-medium">Sort by:</span>
        {options.find((o) => o.value === activeSort)?.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close dropdown when clicking outside */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-3xl p-2 shadow-2xl shadow-black/50 z-50 overflow-hidden"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    activeSort === option.value
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                      : "text-gray-300 hover:bg-slate-700/60 hover:text-emerald-300"
                  }`}
                >
                  {option.label}
                  {activeSort === option.value && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
