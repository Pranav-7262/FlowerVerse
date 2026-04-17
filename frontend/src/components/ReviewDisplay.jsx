import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Trash2, Edit2, X } from "lucide-react";

import api from "../api/axios.js";

const ReviewDisplay = ({
  reviews,
  averageRating,
  totalReviews,
  currentUserId,
  currentUserRole,
  onReviewDeleted,
  onReviewUpdated,
}) => {
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    try {
      await api.delete(`/reviews/${reviewId}`);
      if (onReviewDeleted) {
        onReviewDeleted(reviewId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (review) => {
    setEditingReviewId(review._id);
    setEditingData({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });
  };

  const handleEditSave = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.patch(
        `/reviews/${editingReviewId}`,
        editingData,
      );
      if (onReviewUpdated) {
        onReviewUpdated(response.data.data);
      }
      setEditingReviewId(null);
      setEditingData({});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );

  if (!reviews || reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 rounded-2xl p-8 border border-rose-200/50 text-center"
      >
        <p className="text-slate-600 text-lg">
          No reviews yet. Be the first to review!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-2xl p-8 border border-amber-600/30">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-amber-400 mb-2">
              {averageRating?.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating || 0))}
            </div>
            <p className="text-sm text-slate-600">
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 w-12">
                    {stars} {stars === 1 ? "star" : "stars"}
                  </span>
                  <div className="w-32 h-2 bg-slate-300 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-8">
                    {Math.round(percentage)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-600/20 border border-red-600/40 text-red-300 px-4 py-3 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/70 rounded-xl p-6 border border-rose-200/50 hover:shadow-lg hover:shadow-rose-200/20 transition-shadow"
          >
            {editingReviewId === review._id ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setEditingData({ ...editingData, rating: star })
                        }
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= editingData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={editingData.title}
                  onChange={(e) =>
                    setEditingData({ ...editingData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-rose-200/50 rounded-lg bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600"
                  maxLength="100"
                />

                <textarea
                  value={editingData.comment}
                  onChange={(e) =>
                    setEditingData({ ...editingData, comment: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-rose-200/50 rounded-lg bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
                  rows="3"
                  maxLength="1000"
                />

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingReviewId(null)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-700 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={loading}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-slate-400 transition-colors"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {review.reviewer?.userName}
                        </p>
                        <p className="text-xs text-slate-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">
                      {review.title}
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>

                  {(currentUserId === review.reviewer?._id ||
                    currentUserRole === "admin") && (
                    <div className="flex items-center gap-2 ml-4">
                      {currentUserId === review.reviewer?._id && (
                        <button
                          onClick={() => handleEditStart(review)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit review"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={loading}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-100/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed\"
                        title="Delete review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReviewDisplay;
