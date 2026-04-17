import React from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight, Heart } from "lucide-react";
import StarRating from "./StarRating";

const FlowerCard = ({ flower, onNavigate, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-2xl p-5 border border-rose-100/50 shadow-md hover:shadow-2xl hover:border-rose-200 transition-all duration-500 flex flex-col h-full overflow-hidden"
    >
      {/* Gradient Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 w-40 h-40 bg-gradient-to-br from-rose-100/40 to-pink-100/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />

      {/* Image Container */}
      <div
        onClick={onNavigate}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 cursor-pointer mb-4"
      >
        <img
          src={flower.image}
          alt={flower.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Elegant Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            className="bg-white/95 backdrop-blur-md p-3.5 rounded-full shadow-lg hover:shadow-2xl"
          >
            <ArrowUpRight
              size={20}
              className="text-rose-600"
              strokeWidth={2.5}
            />
          </motion.div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 z-10"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-600"
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-rose-600/95 bg-rose-50/80 px-2.5 py-1.5 rounded-full">
            {flower.category}
          </span>
        </div>

        {/* Flower Name */}
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight mb-2 group-hover:text-rose-700 transition-colors duration-300">
          {flower.name}
        </h3>

        {/* Rating */}
        <div className="mb-4">
          <StarRating
            rating={flower.averageRating || 4}
            totalReviews={flower.totalReviews || 2}
            size={13}
          />
        </div>

        {/* Description/Spacing */}
        <div className="flex-1" />

        {/* Price & Action Footer */}
        <div className="border-t border-rose-100/60 pt-4 flex items-end justify-between gap-3">
          {/* Price Section */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">
              Price
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-slate-900">₹</span>
              <span className="text-2xl font-bold text-rose-700 tracking-tight">
                {flower.price}
              </span>
              {flower.category !== "Mixed Bouquets" && (
                <span className="text-xs text-slate-500 font-semibold ml-1">
                  /kg
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={() => onAddToCart(flower._id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-11 px-4 rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 text-white hover:from-rose-700 hover:to-rose-800 active:scale-95 transition-all duration-300 flex items-center gap-2 text-sm font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300/50 hover:shadow-xl"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowerCard;
