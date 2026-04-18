import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFlower } from "../contexts/FlowerContext";
import { useCart } from "../contexts/CartContext";

// Components
import FilterPanel from "../components/FilterPanel";
import FlowerCard from "../components/FlowerCard";
import SortDropdown from "../components/SortDropdown";
import BouquetsSection from "../components/BouquetsSection";

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
    flowers = [],
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

  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize flowers on first mount
  useEffect(() => {
    if (!hasInitialized) {
      fetchFlowers("All");
      setHasInitialized(true);
    }
  }, []);

  // Handle category filter changes
  useEffect(() => {
    if (selectedCategory !== "All") {
      fetchFlowers(selectedCategory);
    }
  }, [selectedCategory]);

  // Combined Filtering & Sorting Logic
  const displayed = (filteredFlowers.length > 0 ? filteredFlowers : flowers)
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

  // Debug info
  const totalFlowers =
    filteredFlowers.length > 0 ? filteredFlowers.length : flowers.length;

  filteredFlowers.length > 0 ? filteredFlowers.length : flowers.length;

  return (
    <div className="w-full min-h-screen">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-rose-200/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-pink-100/5 blur-[100px] rounded-full" />
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-8 pb-20 relative z-10">
        {/* Unified Search & Action Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Search Input */}
          <div className="relative flex-1 min-w-70 group">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors duration-300"
            />
            <input
              type="text"
              placeholder="Search the private collection..."
              value={search}
              onChange={(e) => searchFlowers(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/70 border border-rose-200/50 text-slate-800 placeholder-slate-500 shadow-md focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500/50 transition-all backdrop-blur-sm outline-none"
            />
          </div>

          {/* Sort & Filter Group */}
          <div className="flex items-center gap-3">
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
              className={`h-14 px-8 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                panelOpen || activeFilters
                  ? "bg-rose-600 border-rose-500 text-white shadow-[0_10px_30px_-5px_rgba(225,29,72,0.4)]"
                  : "bg-white/60 text-slate-600 border-rose-200/50 hover:border-rose-400/50 hover:text-slate-900"
              }`}
            >
              <SlidersHorizontal size={14} strokeWidth={3} />
              {activeFilters ? "Filters Active" : "Filters"}
            </button>

            {activeFilters && (
              <button
                onClick={() => {
                  console.log("🔄 Resetting filters");
                  filterByCategory("All");
                  setPriceRange([0, PRICE_MAX]);
                  searchFlowers(""); // Clear search
                }}
                className="h-14 px-6 rounded-2xl bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-300/50"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 p-8 bg-white/60 border border-rose-200/50 rounded-[2.5rem] backdrop-blur-md shadow-lg"
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

        {/* Flowers Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {loading ? (
            // Loading skeleton
            [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 bg-linear-to-br from-rose-100/30 to-pink-100/20 rounded-3xl animate-pulse"
              />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {displayed.length > 0 ? (
                displayed.map((flower) => (
                  <FlowerCard
                    key={flower._id}
                    flower={flower}
                    onNavigate={() => navigate(`/flowers/${flower._id}`)}
                    onAddToCart={(id) =>
                      user ? addToCart(id, 1) : navigate("/login")
                    }
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-32">
                  <div className="inline-flex p-6 rounded-full bg-rose-100/50 border border-rose-200 mb-4">
                    <Search size={32} className="text-rose-600/60" />
                  </div>
                  <p className="text-slate-600 text-sm font-bold uppercase tracking-widest mb-2">
                    No flowers found
                  </p>
                  <p className="text-slate-500 text-xs">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Flowers Count Info */}
        {!loading && displayed.length > 0 && (
          <div className="mt-8 text-center text-sm text-slate-600">
            Showing{" "}
            <span className="font-bold text-rose-700">{displayed.length}</span>{" "}
            of <span className="font-bold text-rose-700">{totalFlowers}</span>{" "}
            flowers
          </div>
        )}

        {/* Featured Section Divider */}
        <div className="mt-40 pt-20 border-t border-rose-200/30">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-serif font-black text-rose-900 tracking-tight">
              Curated Bouquets
            </h2>
            <button
              onClick={() => filterByCategory("Mixed Bouquets")}
              className="group text-[10px] font-black uppercase tracking-widest text-rose-700 flex items-center gap-2"
            >
              View All{" "}
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
          <BouquetsSection
            onViewAll={() => filterByCategory("Mixed Bouquets")}
          />
        </div>
      </div>
    </div>
  );
}
