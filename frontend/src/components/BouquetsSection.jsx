import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useFlower } from "../contexts/FlowerContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import FlowerCard from "./FlowerCard";

const BouquetsSection = ({ onViewAll }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flowers, loading, fetchFlowers } = useFlower();
  const { addToCart } = useCart();
  const [bouquets, setBouquets] = useState([]);

  useEffect(() => {
    const loadBouquets = async () => {
      const flowersData = await fetchFlowers("Mixed Bouquets");
      if (flowersData) {
        setBouquets(flowersData.slice(0, 4)); // Show first 4 bouquets
      }
    };
    loadBouquets();
  }, []);

  if (loading || bouquets.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-24 mb-32 pt-12"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400/70 mb-2"
          >
            Curated Collections
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300"
          >
            Exquisite Bouquets
          </motion.h2>
        </div>
        <motion.button
          whileHover={{ x: 5 }}
          onClick={onViewAll}
          className="h-12 px-6 rounded-full bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/50 text-emerald-300 text-sm font-bold hover:bg-gradient-to-r hover:from-emerald-600/40 hover:to-teal-600/40 transition-all flex items-center gap-2 group"
        >
          View All
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </motion.button>
      </div>

      {/* Bouquets Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
      >
        <AnimatePresence mode="popLayout">
          {bouquets.map((bouquet, idx) => (
            <motion.div
              key={bouquet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <FlowerCard
                flower={bouquet}
                onNavigate={() => navigate(`/flowers/${bouquet._id}`)}
                onAddToCart={(id) =>
                  user ? addToCart(id, 1) : navigate("/login")
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent rounded-full"
      />
    </motion.div>
  );
};

export default BouquetsSection;
