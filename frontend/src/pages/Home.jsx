import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Install via: npm install framer-motion
import api from "../api/axios.js";
import { useAuth } from "../contexts/AuthContext";

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

  const [flowers, setFlowers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch flowers based on category
  useEffect(() => {
    const fetchFlowers = async () => {
      setLoading(true);
      try {
        // Adjusting query param based on selection
        const endpoint =
          selectedCategory === "All"
            ? "/flowers"
            : `/flowers?category=${selectedCategory}`;

        const res = await api.get(endpoint);
        setFlowers(res.data.data.flowers || []);
      } catch (err) {
        console.error("Failed to load flowers", err);
        setFlowers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowers();
  }, [selectedCategory]); // Re-run when category changes

  const filteredFlowers = flowers.filter((flower) =>
    flower.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddToCart = async (flowerId) => {
    if (!user) return navigate("/login");
    try {
      await api.post("/cart/add", { flowerId, quantity: 1 });
      toast.success("Added to cart 🌸");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 space-y-10 pb-20">
      {/* Hero Section with Glassmorphism */}
      <section className="relative overflow-hidden bg-emerald-900 rounded-3xl text-white p-8 md:p-16 shadow-2xl">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight"
          >
            Nature's Poetry <br />
            <span className="text-emerald-400">In Every Bloom.</span>
          </motion.h1>
          <p className="text-emerald-100 text-lg md:text-xl">
            Experience the freshest selections from local artisans, delivered
            straight to your doorstep.
          </p>
        </div>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      </section>

      {/* Search & Category Filter */}
      <div className="sticky top-4 z-30 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-gray-100 focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <span className="absolute left-3 top-3.5 opacity-40">🔍</span>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-80 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredFlowers.map((flower) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={flower._id}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={flower?.image}
                    alt={flower?.name}
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
                    ₹{flower.price}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 truncate">
                      {flower?.name}
                    </h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      Curated by {flower.owner?.userName}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/flowers/${flower._id}`)}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAddToCart(flower._id)}
                      className="p-3 border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {filteredFlowers.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-3xl">🥀</p>
          <p className="text-gray-500 mt-2">
            No flowers match your search in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
