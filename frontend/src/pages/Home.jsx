import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Eye, Flower2 } from "lucide-react";
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
    } catch (err) {
      // Error toast already shown by context
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] pb-20">
      {/* Wrapper to contain content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pt-6">
        {/* Hero Section - Balanced Sizing */}
        <section className="relative overflow-hidden bg-emerald-950 rounded-[2.5rem] text-white p-8 md:p-16 shadow-2xl min-h-100 flex items-center">
          <div className="relative z-10 space-y-6 max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/30">
                Spring Collection 2026
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-serif font-bold leading-tight"
            >
              Nature's Poetry <br />
              <span className="text-emerald-400 italic">In Every Bloom.</span>
            </motion.h1>
            <p className="text-emerald-100/80 text-base md:text-lg max-w-md">
              Hand-picked selections from local artisans, delivered with love to
              your doorstep.
            </p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-10 opacity-10 pointer-events-none">
            <Flower2 size={300} />
          </div>
        </section>

        {/* Sticky Toolbar - Improved Spacing */}
        <div className="sticky top-6 z-40">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/70 backdrop-blur-xl p-3 rounded-4xl shadow-xl shadow-gray-200/50 border border-white/20">
            {/* Search Bar */}
            <div className="relative w-full lg:w-1/3">
              <input
                type="text"
                placeholder="Search blooms..."
                value={search}
                onChange={(e) => searchFlowers(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-gray-50 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              />
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
            </div>

            {/* Category Pills - Smooth Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full lg:flex-1 justify-start lg:justify-end px-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => filterByCategory(cat)}
                  className={`px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                      : "bg-white text-gray-500 hover:bg-emerald-50 border border-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid - Managed Sizing */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-100 bg-white rounded-4xl animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredFlowers.map((flower) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={flower._id}
                  className="group bg-white rounded-4xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full"
                >
                  {/* Image Container - Fixed Aspect Ratio */}
                  <div className="relative aspect-4/5 overflow-hidden">
                    <img
                      src={flower?.image}
                      alt={flower?.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-black text-emerald-800 shadow-lg">
                        ₹{flower.price}
                      </span>
                    </div>
                  </div>

                  {/* Content - Flex Grow to keep buttons aligned */}
                  <div className="p-6 space-y-4 flex flex-col grow">
                    <div className="grow">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-emerald-700 transition-colors">
                        {flower?.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-1">
                        Artisan: {flower.owner?.userName}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => navigate(`/flowers/${flower._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all active:scale-95"
                      >
                        <Eye size={16} /> View
                      </button>
                      <button
                        onClick={() => handleAddToCart(flower._id)}
                        className="p-3.5 border-2 border-emerald-600/10 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredFlowers.length === 0 && !loading && (
          <div className="text-center py-32 space-y-4">
            <div className="inline-block p-6 bg-gray-100 rounded-full text-gray-300">
              <Flower2 size={48} />
            </div>
            <p className="text-gray-400 font-medium text-lg">
              No blooms found in this meadow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
