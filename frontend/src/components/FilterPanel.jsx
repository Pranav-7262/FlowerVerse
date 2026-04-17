import React from "react";
import { motion } from "framer-motion";

const FilterPanel = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  setPriceRange,
  PRICE_MAX,
}) => {
  return (
    <div className="bg-gradient-to-br from-white/50 to-rose-50/30 border border-rose-200/50 rounded-3xl p-6 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700/70 mb-4">
            Collection
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-2 rounded-full border text-xs transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-rose-600 to-pink-600 border-rose-500 text-white shadow-md shadow-rose-600/40"
                    : "bg-white/50 border-rose-200/50 text-slate-600 hover:bg-rose-50/60 hover:border-rose-400/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Price Range */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700/70">
              Price Range
            </p>
            <span className="text-sm font-bold text-rose-700 bg-rose-100/50 border border-rose-300/50 px-3 py-1 rounded-lg">
              ₹{priceRange[0]} – ₹{priceRange[1]}
            </span>
          </div>
          <div className="space-y-4">
            {[0, 1].map((idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-500 w-8">
                  {idx === 0 ? "MIN" : "MAX"}
                </span>
                <input
                  type="range"
                  min={0}
                  max={PRICE_MAX}
                  step={50}
                  value={priceRange[idx]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPriceRange((prev) => {
                      const next = [...prev];
                      next[idx] = v;
                      if (idx === 0 && v > next[1]) next[1] = v;
                      if (idx === 1 && v < next[0]) next[0] = v;
                      return next;
                    });
                  }}
                  className="flex-1 accent-rose-500 h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FilterPanel;
