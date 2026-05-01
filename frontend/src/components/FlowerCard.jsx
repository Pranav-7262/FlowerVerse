import React from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight } from "lucide-react";
import StarRating from "./StarRating";

const FlowerCard = ({ flower, onNavigate, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-3xl border border-rose-100 shadow-sm hover:shadow-2xl hover:border-rose-300/50 transition-all duration-500 flex flex-col h-full overflow-hidden"
    >
      {/* Gradient Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 w-48 h-48 bg-linear-to-br from-rose-100/50 to-pink-100/30 rounded-full blur-3xl group-hover:scale-130 transition-transform duration-700" />

      {/* Image Container */}
      <div
        onClick={onNavigate}
        className="relative w-full aspect-3/4 overflow-hidden rounded-2xl bg-linear-to-br from-rose-50 to-pink-50 cursor-pointer"
      >
        <img
          src={flower.image}
          alt={flower.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Elegant Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-lg p-4 rounded-full shadow-2xl"
          >
            <ArrowUpRight
              size={22}
              className="text-rose-600"
              strokeWidth={2.5}
            />
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1.5 rounded-full">
            {flower.category}
          </span>
        </div>

        {/* Flower Name */}
        <h3
          onClick={onNavigate}
          className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-rose-700 transition-colors duration-300 cursor-pointer"
        >
          {flower.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <StarRating
            rating={flower.averageRating || 4}
            totalReviews={flower.totalReviews || 2}
            size={13}
          />
          <span className="text-xs text-slate-500">
            ({flower.totalReviews || 0})
          </span>
        </div>

        {/* Spacing */}
        <div className="flex-1" />

        {/* Price & Action Footer */}
        <div className="border-t border-rose-100 pt-4 flex flex-col gap-3">
          {/* Price Section */}
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              ₹
            </span>
            <span className="text-2xl font-bold text-rose-700">
              {flower.price}
            </span>
            {flower.category !== "Mixed Bouquets" && (
              <span className="text-xs text-slate-500 font-medium ml-auto">
                per kg
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={() => onAddToCart(flower._id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-rose-600 to-rose-700 text-white hover:from-rose-700 hover:to-rose-800 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-rose-200 hover:shadow-lg"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowerCard;
