import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import api from "../api/axios.js";

const ReviewForm = ({ flowerId, onReviewAdded, user }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rating || !title || !comment) {
      setError("Please fill all fields including rating");
      return;
    }

    if (comment.length < 10) {
      setError("Comment must be at least 10 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/reviews/${flowerId}`, {
        rating,
        title,
        comment,
      });

      setSuccess("Review added successfully!");
      setRating(0);
      setTitle("");
      setComment("");

      // Call the callback to refresh reviews
      if (onReviewAdded) {
        onReviewAdded(response.data.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-amber-600/20 border border-amber-600/40 rounded-xl p-6 text-center">
        <p className="text-slate-700">
          Please{" "}
          <a
            href="/login"
            className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
          >
            log in
          </a>{" "}
          to write a review.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 rounded-2xl p-8 border border-rose-200/50 shadow-lg shadow-rose-200/20"
    >
      <h3 className="text-2xl font-bold text-slate-900 mb-1">Write a Review</h3>
      <p className="text-slate-600 text-sm mb-6">
        Share your experience with this flower
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-100 mb-2">
            Rating *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-amber-300 font-medium mt-2">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-100 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience in a few words"
            className="w-full px-4 py-3 border border-rose-200/50 rounded-lg bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent transition"
            maxLength="100"
          />
          <p className="text-xs text-gray-400 mt-1">{title.length}/100</p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold text-gray-100 mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about your experience (minimum 10 characters)"
            className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
            rows="4"
            maxLength="1000"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-400">{comment.length}/1000</p>
            {comment.length < 10 && comment.length > 0 && (
              <p className="text-xs text-red-400">
                Minimum 10 characters required
              </p>
            )}
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

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-emerald-600/20 border border-emerald-600/40 text-emerald-300 px-4 py-3 rounded-lg text-sm"
          >
            {success}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              Submit Review
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
