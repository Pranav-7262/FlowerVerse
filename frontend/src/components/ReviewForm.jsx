import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const ReviewForm = ({ flowerId, onReviewAdded, user, canReview = true }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
      toast.success("Review added successfully!");
      setRating(0);
      setTitle("");
      setComment("");

      // Call the callback to refresh reviews
      if (onReviewAdded) {
        onReviewAdded(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (!canReview) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
            Rating
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
            <p className="text-sm text-amber-600 font-bold mt-2">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience in a few words"
            className="w-full px-4 py-3 border border-rose-200/50 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent transition"
            maxLength="100"
          />
          <p className="text-xs text-slate-500 mt-1">{title.length}/100</p>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details about your experience (minimum 10 characters)"
            className="w-full px-4 py-3 border border-rose-200/50 rounded-xl bg-white/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent transition resize-none"
            rows="4"
            maxLength="1000"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-slate-500">{comment.length}/1000</p>
            {comment.length < 10 && comment.length > 0 && (
              <p className="text-xs text-red-500 font-medium">
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
            className="bg-red-100/50 border border-red-300/50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              Post Review
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
