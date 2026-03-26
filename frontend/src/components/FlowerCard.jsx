import React from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpRight } from "lucide-react";
import StarRating from "./StarRating";

const FlowerCard = ({ flower, onNavigate, onAddToCart }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[2.5rem] p-4 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(6,78,59,0.12)] transition-all duration-500 ease-in-out flex flex-col h-full"
    >
      <div
        onClick={onNavigate}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[#F5F5F4] cursor-pointer"
      >
        <img
          src={flower.image}
          alt={flower.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />

        <div className="absolute top-4 left-4 bg-white/40 backdrop-blur-xl border border-white/40 px-3 py-1.5 rounded-2xl shadow-sm">
          <span className="text-xs font-black text-emerald-950">
            ₹{flower.price}
          </span>
        </div>

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-white/90 p-3 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500">
            <ArrowUpRight size={20} className="text-emerald-900" />
          </div>
        </div>
      </div>

      <div className="mt-5 px-1 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700/60 block mb-1">
            {flower.category}
          </span>
          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 leading-tight">
            {flower.name}
          </h3>
        </div>

        <div className="mb-4">
          <StarRating
            rating={flower.averageRating || 4}
            totalReviews={flower.totalReviews || 2}
            size={12}
          />
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">
              Availability
            </span>
            <span className="text-[10px] font-black text-emerald-800">
              In Stock
            </span>
          </div>

          <button
            onClick={() => onAddToCart(flower._id)}
            className="h-11 w-11 rounded-2xl bg-emerald-900 text-white shadow-lg shadow-emerald-900/20 active:scale-90 transition-all duration-300 flex items-center justify-center hover:bg-emerald-800"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowerCard;
