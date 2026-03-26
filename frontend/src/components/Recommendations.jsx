import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFlower } from "../contexts/FlowerContext";
import FlowerCard from "./FlowerCard";
import { Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Recommendations = ({ currentFlowerId, category }) => {
  // Destructure fetchFlowers (or your context's loading function)
  const { flowers, fetchFlowers } = useFlower();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  //
  useEffect(() => {
    if (!flowers || flowers.length === 0) {
      fetchFlowers();
    }
  }, [flowers, fetchFlowers]);

  const suggestedFlowers = useMemo(() => {
    if (!flowers || flowers.length === 0) return [];

    // Filter by same category
    let filtered = flowers.filter(
      (f) => f.category === category && f._id !== currentFlowerId,
    );

    if (filtered.length === 0) {
      filtered = flowers.filter((f) => f._id !== currentFlowerId);
    }

    return filtered.slice(0, 4);
  }, [flowers, category, currentFlowerId]);

  if (suggestedFlowers.length === 0) return null;

  return (
    <section className="mt-20 border-t border-gray-100 pt-16 mb-20">
      <div className="flex items-center justify-between mb-10 px-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Top new picks of similar items
          </h2>
        </div>

        <button
          onClick={() => navigate("/")}
          className="text-sm font-bold text-gray-400 hover:text-emerald-900 transition-colors"
        >
          View All →
        </button>
      </div>

      {/* Horizontal scroll on mobile, Grid on Desktop */}
      <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar lg:grid lg:grid-cols-4 lg:overflow-visible px-4">
        <AnimatePresence mode="popLayout">
          {suggestedFlowers.map((flower, i) => (
            <motion.div
              key={flower._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[280px] lg:min-w-0"
            >
              <FlowerCard
                flower={flower}
                onNavigate={() => {
                  navigate(`/flowers/${flower._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onAddToCart={(id) =>
                  user ? addToCart(id, 1) : navigate("/login")
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Recommendations;
