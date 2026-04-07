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
      className="group relative bg-linear-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-5 border border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_60px_rgba(236,72,153,0.3)] hover:border-pink-500/50 transition-all duration-500 ease-in-out flex flex-col h-full"
    >
      <div
        onClick={onNavigate}
        className="relative aspect-4/5 w-full overflow-hidden rounded-4xl bg-slate-700 cursor-pointer ring-2 ring-slate-600"
      >
        <img
          src={flower.image}
          alt={flower.name}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />

        <div className="absolute top-4 left-4 bg-linear-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-xl border border-emerald-400/50 px-4 py-2 rounded-2xl shadow-lg shadow-emerald-600/40">
          <span className="text-xs font-black text-white">
            ₹
            {flower.category === "Mixed Bouquets"
              ? flower.price
              : `${flower.price}/kg`}
          </span>
        </div>

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-linear-to-r from-emerald-500 to-teal-500 p-3 rounded-full shadow-2xl shadow-emerald-600/50 transform scale-75 group-hover:scale-100 transition-all duration-500">
            <ArrowUpRight size={20} className="text-white" />
          </div>
        </div>
      </div>

      <div className="mt-5 px-1 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/70 block mb-1">
            {flower.category}
          </span>
          <h3 className="text-[15px] font-bold text-gray-100 line-clamp-1 leading-tight">
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
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-700">
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">
              Availability
            </span>
            <span className="text-[10px] font-black text-emerald-400">
              In Stock
            </span>
          </div>

          <button
            onClick={() => onAddToCart(flower._id)}
            className="h-11 w-11 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/40 active:scale-90 transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:shadow-emerald-600/60"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlowerCard;
