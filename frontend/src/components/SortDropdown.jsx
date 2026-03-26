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
        className="flex items-center gap-2 h-12 px-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-bold text-gray-800 hover:border-emerald-200 transition-all"
      >
        <span className="text-gray-400 font-medium">Sort by:</span>
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
              className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-2 shadow-2xl z-50 overflow-hidden"
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
                      ? "bg-emerald-900 text-white"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
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
