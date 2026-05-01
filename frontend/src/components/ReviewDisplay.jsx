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
        className="bg-white/70 rounded-[2.5rem] p-12 border border-rose-200/50 text-center"
      >
        <p className="text-slate-600 text-lg font-medium">
          No reviews yet. Be the first to share your experience with this bloom!
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
      <div className="bg-white/70 rounded-[2.5rem] p-10 border border-rose-200/50 shadow-lg shadow-rose-200/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="text-center md:text-left min-w-max">
            <div className="text-6xl font-black text-rose-600 mb-3">
              {averageRating?.toFixed(1)}
            </div>
            <div className="flex justify-center md:justify-start mb-3">
              {renderStars(Math.round(averageRating || 0))}
            </div>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="w-full md:flex-1 space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700 w-16">
                    {stars} {stars === 1 ? "star" : "stars"}
                  </span>
                  <div className="flex-1 h-2 bg-rose-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-rose-600 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-600 w-10 text-right">
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
          className="bg-red-100/50 border border-red-300/50 text-red-600 px-6 py-4 rounded-xl text-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-5">
        {reviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/70 rounded-[2rem] p-8 border border-rose-200/50 hover:shadow-lg hover:shadow-rose-200/20 transition-all"
          >
            {editingReviewId === review._id ? (
              // Edit Mode
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-widest">
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
                          size={28}
                          className={`${
                            star <= editingData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingData.title}
                    onChange={(e) =>
                      setEditingData({ ...editingData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-rose-200/50 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600"
                    maxLength="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">
                    Comment
                  </label>
                  <textarea
                    value={editingData.comment}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        comment: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-rose-200/50 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
                    rows="4"
                    maxLength="1000"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setEditingReviewId(null)}
                    className="px-6 py-2 text-slate-600 hover:text-slate-700 hover:bg-white/70 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 transition-all font-bold"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 mb-3">
                      <div>
                        <p className="font-black text-slate-900 text-sm">
                          {review.reviewer?.userName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">
                      {review.title}
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {review.comment}
                    </p>
                  </div>

                  {(currentUserId === review.reviewer?._id ||
                    currentUserRole === "admin") && (
                    <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                      {currentUserId === review.reviewer?._id && (
                        <button
                          onClick={() => handleEditStart(review)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit review"
                        >
                          <Edit2 size={18} strokeWidth={2} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={loading}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-100/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete review"
                      >
                        <Trash2 size={18} strokeWidth={2} />
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
