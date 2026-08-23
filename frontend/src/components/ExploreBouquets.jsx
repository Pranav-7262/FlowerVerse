import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, ShoppingBag } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import FlowerCard from "./FlowerCard";
import api from "../api/axios";

const ExploreBouquets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch bouquets with pagination
  const fetchBouquets = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get("/flowers/mixedBouquet", {
        params: { page, limit: 8 },
      });

      setBouquets(response.data.data.bouquets || []);

      const total = response.data.data.total || 0;
      setTotalPages(Math.ceil(total / 8));
      setCurrentPage(page);
    } catch (error) {
      console.error("❌ Error fetching bouquets:", error);
      setBouquets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBouquets(1);
  }, []);

  // Sort bouquets
  const sortedBouquets = [...bouquets].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const handlePageChange = (page) => {
    fetchBouquets(page);
    window.scrollTo({
      top: document.getElementById("explore-section")?.offsetTop - 100,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (flowerid) => {
    if (user) {
      addToCart(flowerid, 1);
    } else {
      navigate("/login");
    }
  };

  return (
    <motion.div
      id="explore-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-3"
        >
          <Sparkles size={20} className="text-rose-600" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-rose-700/70">
            Premium Collections
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-rose-700 via-pink-600 to-red-600 mb-4"
        >
          Special Bouquets
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg max-w-2xl"
        >
          Discover our handcrafted mixed bouquets, perfect for every occasion.
          Each bouquet is carefully curated to bring joy and beauty.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-gray-200"
      >
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-bold text-gray-900">{bouquets.length}</span>{" "}
          bouquets
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-rose-300 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </motion.div>

      {/* Bouquets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {[...Array(8)].map((_, idx) => (
            <motion.div
              key={idx}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-96 bg-linear-to-br from-gray-100 to-gray-50 rounded-2xl"
            />
          ))}
        </div>
      ) : bouquets.length > 0 ? (
        <>
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8"
          >
            <AnimatePresence mode="popLayout">
              {sortedBouquets.map((bouquet, idx) => (
                <motion.div
                  key={bouquet._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <FlowerCard
                    flower={bouquet}
                    onNavigate={() => navigate(`/flowers/${bouquet._id}`)}
                    onAddToCart={() => handleAddToCart(bouquet._id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-200"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 w-10 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </motion.button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(page)}
                      className={`h-10 w-10 rounded-lg font-bold transition-all ${
                        currentPage === page
                          ? "bg-rose-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </motion.button>
                  ),
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 w-10 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            No bouquets available at the moment
          </p>
        </motion.div>
      )}

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-10 h-1 bg-linear-to-r from-transparent via-rose-400/40 to-transparent rounded-full"
      />
    </motion.div>
  );
};

export default ExploreBouquets;
