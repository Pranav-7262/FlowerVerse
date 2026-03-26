import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFlower } from "../contexts/FlowerContext";
import { useCart } from "../contexts/CartContext";

// Components
import FilterPanel from "../components/FilterPanel";
import FlowerCard from "../components/FlowerCard";
import SortDropdown from "../components/SortDropdown";

const CATEGORIES = [
  "All",
  "Roses",
  "Tulips",
  "Daisies",
  "Lilies",
  "Orchids",
  "Sunflowers",
  "Lotus",
  "Hibiscus",
  "Jasmines",
  "Marigolds",
  "Carnations",
  "Mixed Bouquets",
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "A → Z", value: "name_asc" },
];

const PRICE_MAX = 2000;

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    filteredFlowers = [],
    search,
    selectedCategory,
    loading,
    fetchFlowers,
    searchFlowers,
    filterByCategory,
  } = useFlower();
  const { addToCart } = useCart();

  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, PRICE_MAX]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    fetchFlowers(selectedCategory);
  }, [selectedCategory]);

  // Combined Filtering & Sorting Logic
  const displayed = filteredFlowers
    .filter((f) => f.price >= priceRange[0] && f.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "newest")
        return new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id);
      return 0;
    });

  const activeFilters =
    selectedCategory !== "All" ||
    priceRange[0] > 0 ||
    priceRange[1] < PRICE_MAX;

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        {/* Unified Search & Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search our garden..."
              value={search}
              onChange={(e) => searchFlowers(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border-none shadow-sm text-sm focus:ring-2 focus:ring-emerald-900/10 transition-all"
            />
          </div>

          {/* Sort & Filter Group */}
          <div className="flex items-center gap-2">
            <SortDropdown
              options={SORT_OPTIONS}
              activeSort={sortBy}
              onSortChange={setSortBy}
              isOpen={sortOpen}
              setIsOpen={setSortOpen}
            />

            <button
              onClick={() => {
                setPanelOpen(!panelOpen);
                setSortOpen(false);
              }}
              className={`h-12 px-6 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all ${
                panelOpen || activeFilters
                  ? "bg-emerald-900 text-white shadow-xl shadow-emerald-900/20"
                  : "bg-white text-gray-700 shadow-sm border border-gray-100 hover:border-emerald-200"
              }`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            {activeFilters && (
              <button
                onClick={() => {
                  filterByCategory("All");
                  setPriceRange([0, PRICE_MAX]);
                }}
                className="h-12 px-4 rounded-2xl bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <FilterPanel
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={filterByCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                PRICE_MAX={PRICE_MAX}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayed.map((flower) => (
              <FlowerCard
                key={flower._id}
                flower={flower}
                onNavigate={() => navigate(`/flowers/${flower._id}`)}
                onAddToCart={(id) =>
                  user ? addToCart(id, 1) : navigate("/login")
                }
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && displayed.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm font-medium">
              No flowers match your selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
