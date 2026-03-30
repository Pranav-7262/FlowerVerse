import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Pencil,
  Trash2,
  ArrowLeft,
  User,
  Tag,
  ShieldCheck,
  Layers,
  AlertCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFlower } from "../contexts/FlowerContext";
import { useCart } from "../contexts/CartContext";
import ReviewForm from "../components/ReviewForm";
import ReviewDisplay from "../components/ReviewDisplay";
import api from "../api/axios";
import Recommendations from "../components/Recommendations";
import StarRating from "../components/StarRating";

const FlowerDetails = () => {
  const { flowerId } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { selectedFlower, loading, fetchFlowerById, deleteFlower } =
    useFlower();
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchFlowerById(flowerId);
    fetchReviews();
  }, [flowerId]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.get(`/reviews/${flowerId}`);
      console.log("resp :", response.data.data.reviews);

      setReviews(response.data.data.reviews);
      setAverageRating(response.data.data.averageRating);
      setTotalReviews(response.data.data.totalReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewAdded = (newReview) => {
    // Refetch reviews to get updated data from backend
    fetchReviews();
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter((r) => r._id !== reviewId));
    fetchReviews(); // Refetch to update average rating
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews(
      reviews.map((r) => (r._id === updatedReview._id ? updatedReview : r)),
    );
    fetchReviews(); // Refetch to update average rating
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to remove this flower?")) return;
    try {
      await deleteFlower(flowerId);
      navigate("/");
    } catch (err) {
      // Error toast already shown by context
    }
  };

  const handleAddToCart = async (flowerId) => {
    if (!user) return navigate("/login");
    try {
      await addToCart(flowerId, 1);
    } catch (err) {
      // Error toast already shown by context
    }
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!selectedFlower)
    return <div className="text-center py-20">Flower not found.</div>;

  const isOwner = user && user._id === selectedFlower.owner?._id;

  // Stock Logic
  const isOutOfStock = selectedFlower.stock <= 0;
  const isLowStock = selectedFlower.stock > 0 && selectedFlower.stock <= 5;

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Back Button - Minimalist */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-emerald-400 transition-all duration-300"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Return to Garden
        </button>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-16 bg-slate-900/40 rounded-[3.5rem] p-8 lg:p-14 shadow-2xl border border-slate-800/60 backdrop-blur-xl mb-24 overflow-hidden relative"
        >
          {/* Left: Premium Image Display */}
          <div className="w-full lg:w-[45%]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-slate-800"
            >
              <img
                src={selectedFlower.image}
                alt={selectedFlower.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
              />

              {/* Glassmorphism Sold Out Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center">
                  <span className="bg-slate-900/80 text-red-400 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.4em] shadow-2xl border border-red-500/20 text-xs">
                    Sold Out
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Content Details */}
          <div className="w-full lg:w-[55%] flex flex-col justify-between py-2">
            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
                    <Tag size={12} strokeWidth={3} /> {selectedFlower?.category}
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-serif font-black text-white tracking-tighter leading-none">
                    {selectedFlower?.name}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-white tracking-tight">
                    <span className="text-emerald-500 text-xl align-top mr-1 font-serif">
                      ₹
                    </span>
                    {selectedFlower.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                    Private Reserve
                  </p>
                </div>
              </div>

              {/* Star Rating Section */}
              {totalReviews > 0 && (
                <div className="flex items-center gap-4 py-2 border-y border-slate-800/50">
                  <div className="flex gap-1 text-amber-400">
                    <StarRating rating={averageRating} size={16} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      ({totalReviews} Reviews)
                    </span>
                  </div>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div
                className={`flex items-center gap-4 p-5 rounded-[1.8rem] border backdrop-blur-sm ${
                  isOutOfStock
                    ? "bg-red-500/5 border-red-500/20"
                    : isLowStock
                      ? "bg-amber-500/5 border-amber-500/20"
                      : "bg-emerald-500/5 border-emerald-500/20"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${isOutOfStock ? "text-red-400" : isLowStock ? "text-amber-400" : "text-emerald-400"}`}
                >
                  {isOutOfStock ? (
                    <AlertCircle size={20} />
                  ) : (
                    <Layers size={20} />
                  )}
                </div>
                <div>
                  <p
                    className={`text-xs font-black uppercase tracking-widest ${isOutOfStock ? "text-red-400" : isLowStock ? "text-amber-400" : "text-emerald-400"}`}
                  >
                    {isOutOfStock
                      ? "Unavailable"
                      : isLowStock
                        ? "Limited Reserve"
                        : "Ready for Shipment"}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {isOutOfStock
                      ? "Currently out of nursery"
                      : `${selectedFlower.stock} units in climate control`}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-lg leading-relaxed font-medium opacity-90 italic font-serif">
                "{selectedFlower.description}"
              </p>

              {/* Ownership Meta */}
              <div className="flex items-center gap-4 py-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-500">
                  <User size={18} />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Cultivated by{" "}
                  <span className="text-white font-black">
                    {selectedFlower.owner?.userName}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-12 pt-10 border-t border-slate-800/60">
              {isOwner ? (
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => navigate(`/flowers/edit/${flowerId}`)}
                    className="flex items-center justify-center gap-3 bg-white text-slate-950 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all"
                  >
                    <Pencil size={18} strokeWidth={3} /> Edit Bloom
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-3 bg-slate-800/50 text-red-400 border border-red-500/20 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} strokeWidth={3} /> Delete
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <button
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(selectedFlower._id)}
                      className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] border-2 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ShoppingBag size={18} /> Add to Vault
                    </button>

                    <button
                      disabled={isOutOfStock}
                      className="flex-[2] bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:bg-emerald-500 hover:-translate-y-1 disabled:opacity-20 transition-all"
                    >
                      Acquire Now
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white">
                      <ShieldCheck size={14} className="text-emerald-500" />{" "}
                      Secure
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white">
                      <AlertCircle size={14} className="text-emerald-500" />{" "}
                      Insured
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Review Section - Converted to Dark Mode Cards */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-emerald-500 rounded-full" />
            <h2 className="text-4xl font-serif font-black text-white tracking-tight">
              Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <ReviewForm
                flowerId={flowerId}
                onReviewAdded={handleReviewAdded}
                user={user}
              />
            </div>
            <div className="lg:col-span-2">
              <ReviewDisplay
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            </div>
          </div>
        </div>

        <div className="mt-20">
          <Recommendations
            currentFlowerId={selectedFlower?._id}
            category={selectedFlower?.category}
          />
        </div>
      </div>
    </div>
  );
};

export default FlowerDetails;
