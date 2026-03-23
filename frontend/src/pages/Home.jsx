import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Eye,
  Flower2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFlower } from "../contexts/FlowerContext";
import { useCart } from "../contexts/CartContext";

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

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    filteredFlowers,
    search,
    selectedCategory,
    loading,
    fetchFlowers,
    searchFlowers,
    filterByCategory,
  } = useFlower();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFlowers(selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = async (flowerId) => {
    if (!user) return navigate("/login");
    try {
      await addToCart(flowerId, 1);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-8">
        {/* Hero Section - Boutique Style */}
        <section className="relative overflow-hidden bg-[#062C1E] rounded-[3rem] text-white p-10 md:p-20 shadow-[0_30px_60px_-15px_rgba(6,44,30,0.3)]">
          <div className="relative z-10 space-y-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md text-emerald-300 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-emerald-500/20"
            >
              <Sparkles size={12} /> Seasonal Curation 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif font-black leading-[1.1]"
            >
              Fresh Blooms <br />
              <span className="text-emerald-400 italic font-medium">
                For Your Space.
              </span>
            </motion.h1>

            <p className="text-emerald-100/60 text-lg max-w-md font-medium leading-relaxed">
              Experience the luxury of hand-picked, artisan-grown flowers
              delivered fresh from the meadow to your doorstep within 24 hours.
            </p>
          </div>

          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] opacity-10 rotate-12 pointer-events-none">
            <Flower2 size={450} strokeWidth={1} />
          </div>
        </section>

        <div className="sticky top-24 z-40">
          <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col xl:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative w-full xl:w-96">
              <input
                type="text"
                placeholder="Search our garden..."
                value={search}
                onChange={(e) => searchFlowers(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-3xl border-none bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-gray-700 placeholder:text-gray-400"
              />
              <Search
                className="absolute left-5 top-4.5 text-emerald-600"
                size={22}
              />
            </div>

            {/* Category Scroller */}
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <SlidersHorizontal size={18} />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => filterByCategory(cat)}
                    className={`px-6 py-3 rounded-2xl whitespace-nowrap text-[13px] font-black uppercase tracking-wider transition-all duration-300 border ${
                      selectedCategory === cat
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200"
                        : "bg-white text-gray-400 border-gray-100 hover:border-emerald-200 hover:text-emerald-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-112.5 bg-gray-50 rounded-[3rem] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredFlowers.map((flower) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={flower._id}
                  className="group relative bg-white rounded-[3rem] p-4 border border-transparent hover:border-emerald-100 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col h-full"
                >
                  {/* Image wrapper */}
                  <div className="relative aspect-10/12 rounded-[2.5rem] overflow-hidden mb-6">
                    <img
                      src={flower?.image}
                      alt={flower?.name}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                        <span className="text-sm font-black text-gray-900">
                          ₹{flower.price}
                        </span>
                      </div>
                    </div>

                    {/* Hover Quick Action */}
                    <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <button
                        onClick={() => navigate(`/flowers/${flower._id}`)}
                        className="bg-white text-gray-900 p-4 rounded-full shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                      >
                        <Eye size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-2 space-y-2 grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {flower?.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                          {flower.category || "Premium Bloom"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleAddToCart(flower._id)}
                      className="flex-1 bg-gray-900 text-white py-4 rounded-3xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-gray-200 hover:shadow-emerald-200"
                    >
                      <ShoppingBag size={18} /> Add to Bag
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredFlowers.length === 0 && (
          <div className="py-40 text-center">
            <div className="inline-flex p-8 bg-gray-50 rounded-full text-gray-300 mb-6">
              <Flower2 size={60} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              No matches found
            </h2>
            <p className="text-gray-400 mt-2">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
