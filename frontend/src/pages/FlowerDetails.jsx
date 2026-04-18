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
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useFlower } from "../contexts/FlowerContext";
import { useCart } from "../contexts/CartContext";
import ReviewForm from "../components/ReviewForm";
import ReviewDisplay from "../components/ReviewDisplay";
import api from "../api/axios";
import Recommendations from "../components/Recommendations";
import StarRating from "../components/StarRating";
import {
  parseDescriptionPoints,
  limitDescriptionPoints,
  formatDescriptionPoint,
} from "../utils/descriptionParser";

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
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!selectedFlower)
    return <div className="text-center py-20">Flower not found.</div>;

  const isOwner = user && user._id === selectedFlower.owner?._id;

  // Stock Logic
  const isOutOfStock = selectedFlower.stock <= 0;
  const isLowStock = selectedFlower.stock > 0 && selectedFlower.stock <= 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 selection:bg-rose-200/50">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-rose-200/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Back Button - Minimalist */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-rose-700 transition-all duration-300"
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
          className="flex flex-col lg:flex-row gap-16 bg-white/70 rounded-[3.5rem] p-8 lg:p-14 shadow-lg shadow-rose-200/20 border border-rose-200/50 backdrop-blur-sm mb-24 overflow-hidden relative"
        >
          {/* Left: Premium Image Display */}
          <div className="w-full lg:w-[45%]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg shadow-rose-200/30 ring-1 ring-rose-200/50"
            >
              <img
                src={selectedFlower.image}
                alt={selectedFlower.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
              />

              {/* Glassmorphism Sold Out Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-rose-600/20 backdrop-blur-md flex items-center justify-center">
                  <span className="bg-white/80 text-red-600 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.4em] shadow-lg border border-red-300/50 text-xs">
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
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100/60 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-rose-300/50">
                    <Tag size={12} strokeWidth={3} /> {selectedFlower?.category}
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-serif font-black text-slate-900 tracking-tighter leading-none">
                    {selectedFlower?.name}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-slate-900 tracking-tight">
                    <span className="text-rose-600 text-xl align-top mr-1 font-serif">
                      ₹
                    </span>
                    {selectedFlower.price.toLocaleString()}/kg
                  </p>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">
                    Per Kilogram
                  </p>
                </div>
              </div>

              {/* Star Rating Section */}
              {totalReviews > 0 && (
                <div className="flex items-center gap-4 py-2 border-y border-rose-200/50">
                  <div className="flex gap-1 text-amber-400">
                    <StarRating rating={averageRating} size={16} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                      ({totalReviews} Reviews)
                    </span>
                  </div>
                </div>
              )}

              {/* Stock Status Indicator */}
              <div
                className={`flex items-center gap-4 p-5 rounded-[1.8rem] border backdrop-blur-sm ${
                  isOutOfStock
                    ? "bg-red-100/50 border-red-300/50"
                    : isLowStock
                      ? "bg-amber-100/50 border-amber-300/50"
                      : "bg-rose-100/50 border-rose-300/50"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-rose-600"}`}
                >
                  {isOutOfStock ? (
                    <AlertCircle size={20} />
                  ) : (
                    <Layers size={20} />
                  )}
                </div>
                <div>
                  <p
                    className={`text-xs font-black uppercase tracking-widest ${isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-rose-600"}`}
                  >
                    {isOutOfStock
                      ? "Unavailable"
                      : isLowStock
                        ? "Limited Reserve"
                        : "Ready for Shipment"}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    {isOutOfStock
                      ? "Currently out of nursery"
                      : `${selectedFlower.stock} units in climate control`}
                  </p>
                </div>
              </div>

              {/* Description - Line by Line Points */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-rose-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  About This Bloom
                </h3>
                <div className="space-y-3 pl-2">
                  {limitDescriptionPoints(
                    parseDescriptionPoints(selectedFlower.description),
                  ).map((line, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 text-slate-700 leading-relaxed"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-rose-500 flex-shrink-0 mt-0.5"
                        strokeWidth={2}
                      />
                      <p className="text-sm font-medium text-slate-700 opacity-90">
                        {formatDescriptionPoint(line)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ownership Meta */}
              <div className="flex items-center gap-4 py-2">
                <div className="w-10 h-10 rounded-full bg-white/70 border border-rose-200/50 flex items-center justify-center text-rose-600">
                  <User size={18} />
                </div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Cultivated by{" "}
                  <span className="text-slate-900 font-black">
                    {selectedFlower.owner?.userName}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-12 pt-10 border-t border-rose-200/50">
              {isOwner ? (
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => navigate(`/flowers/edit/${flowerId}`)}
                    className="flex items-center justify-center gap-3 bg-white/70 text-slate-900 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-rose-200/50"
                  >
                    <Pencil size={18} strokeWidth={3} /> Edit Bloom
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-3 bg-red-100/50 text-red-600 border border-red-300/50 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition-all"
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
                      className="flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] border-2 border-rose-300 text-rose-600 hover:bg-rose-600 hover:text-white disabled:opacity-20 transition-all"
                    >
                      <ShoppingBag size={18} /> Add to Vault
                    </button>

                    <button
                      disabled={isOutOfStock}
                      className="flex-[2] bg-gradient-to-r from-rose-600 to-pink-600 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-rose-200/30 hover:shadow-rose-300/40 hover:-translate-y-1 disabled:opacity-20 transition-all"
                    >
                      Acquire Now
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-8 opacity-60">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-700">
                      <ShieldCheck size={14} className="text-rose-600" /> Secure
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-700">
                      <AlertCircle size={14} className="text-rose-600" />{" "}
                      Insured
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Review Section - Converted to Light Mode Cards */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1 bg-rose-600 rounded-full" />
            <h2 className="text-4xl font-serif font-black text-slate-900 tracking-tight">
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
                currentUserId={user._id}
                currentUserRole={user.role}
                onReviewDeleted={handleReviewDeleted}
                onReviewUpdated={handleReviewUpdated}
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
