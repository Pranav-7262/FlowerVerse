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
      <div className="min-h-[80vh] flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Main Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-12 bg-white rounded-[2.5rem] p-6 lg:p-10 shadow-xl border border-gray-100 mb-12"
        >
          {/* Left: Image */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-4/5 rounded-4xl overflow-hidden shadow-inner bg-gray-50"
            >
              <img
                src={selectedFlower.image}
                alt={selectedFlower.name}
                className="w-full h-full object-cover"
              />

              {/* Status Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold uppercase tracking-widest shadow-xl">
                    Sold Out
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-tighter mb-3">
                    <Tag size={14} /> {selectedFlower?.category}
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900">
                    {selectedFlower?.name}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">
                    ₹{selectedFlower.price}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Inc. all taxes
                  </p>
                </div>
              </div>

              {/* Rating Section */}
              {totalReviews > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 py-2"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={`${
                          star <= Math.round(averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
                  </span>
                </motion.div>
              )}

              <div
                className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  isOutOfStock
                    ? "bg-red-50 border-red-100"
                    : isLowStock
                      ? "bg-orange-50 border-orange-100"
                      : "bg-emerald-50 border-emerald-100"
                }`}
              >
                {isOutOfStock ? (
                  <AlertCircle className="text-red-500" />
                ) : (
                  <Layers
                    className={
                      isLowStock ? "text-orange-500" : "text-emerald-500"
                    }
                  />
                )}
                <div>
                  <p
                    className={`text-sm font-bold ${
                      isOutOfStock
                        ? "text-red-600"
                        : isLowStock
                          ? "text-orange-600"
                          : "text-emerald-700"
                    }`}
                  >
                    {isOutOfStock
                      ? "Currently Unavailable"
                      : isLowStock
                        ? "Limited Stock Available"
                        : "In Stock & Ready to Ship"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isOutOfStock
                      ? "Check back later"
                      : `${selectedFlower.stock} items currently in the nursery`}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {selectedFlower.description}
              </p>

              <div className="flex items-center gap-4 py-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                    <User size={18} />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Listed by{" "}
                  <span className="text-emerald-600 font-bold">
                    {selectedFlower.owner?.userName}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-gray-100">
              {isOwner ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate(`/flowers/edit/${flowerId}`)}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-gray-200"
                  >
                    <Pencil size={18} /> Update Bloom
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(selectedFlower._id)}
                      className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all border-2 ${
                        isOutOfStock
                          ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-sm"
                      }`}
                    >
                      <ShoppingBag size={20} />
                      Cart
                    </button>

                    {/* Buy Now Button */}
                    <button
                      disabled={isOutOfStock}
                      onClick={() =>
                        navigate("/checkout", {
                          state: {
                            items: [
                              {
                                flower: selectedFlower,
                                quantity: 1,
                                price: selectedFlower.price,
                                name: selectedFlower.name,
                                image: selectedFlower.image,
                              },
                            ],
                            totalAmount: selectedFlower.price,
                          },
                        })
                      }
                      className={`flex-2 flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                        isOutOfStock
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200/50 hover:-translate-y-1"
                      }`}
                    >
                      {isOutOfStock ? "Sold Out" : "Buy it Now"}
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-6 py-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <ShieldCheck size={14} className="text-emerald-500" />{" "}
                      Secure Checkout
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <AlertCircle size={14} className="text-emerald-500" />{" "}
                      Freshness Guaranteed
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <div className="space-y-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <MessageSquare size={28} className="text-emerald-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Customer Reviews
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review Form - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <ReviewForm
                flowerId={flowerId}
                onReviewAdded={handleReviewAdded}
                user={user}
              />
            </motion.div>

            {/* Review Display - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <ReviewDisplay
                  reviews={reviews}
                  averageRating={averageRating}
                  totalReviews={totalReviews}
                  currentUserId={user?._id}
                  currentUserRole={isAdmin ? "admin" : "user"}
                  onReviewDeleted={handleReviewDeleted}
                  onReviewUpdated={handleReviewUpdated}
                />
              )}
            </motion.div>
          </div>
        </div>
        <Recommendations
          currentFlowerId={selectedFlower._id}
          category={selectedFlower?.category}
        />
      </div>
    </div>
  );
};

export default FlowerDetails;
