import async_handler from "express-async-handler";
import Review from "../models/review.model.js";
import Flower from "../models/flower.model.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import { ApiError } from "../lib/ApiError.js";
import { flushAll } from "../lib/redis.js";

export const addReview = async_handler(async (req, res) => {
  const userId = req.userId;
  const { flowerId } = req.params;
  const { rating, title, comment } = req.body;

  // Validate input
  if (!rating || !title || !comment) {
    throw new ApiError(400, "Rating, title, and comment are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (comment.length < 10) {
    throw new ApiError(400, "Comment must be at least 10 characters long");
  }

  // Check if flower exists
  const flower = await Flower.findById(flowerId);
  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }

  // Check if user already reviewed this flower
  const existingReview = await Review.findOne({
    flower: flowerId,
    reviewer: userId,
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this flower");
  }

  // Create review
  const review = await Review.create({
    flower: flowerId,
    reviewer: userId,
    rating,
    title,
    comment,
  });

  // Add review to flower's reviews array
  flower.reviews.push(review._id);

  // Calculate average rating
  const allReviews = await Review.find({ flower: flowerId });
  const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
  flower.averageRating = totalRating / allReviews.length;
  flower.totalReviews = allReviews.length;

  await flower.save();

  const populatedReview = await review.populate("reviewer", "userName");

  await flushAll();

  return res
    .status(201)
    .json(new ApiResponse(201, populatedReview, "Review added successfully"));
});

export const getFlowerReviews = async_handler(async (req, res) => {
  const { flowerId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  const flower = await Flower.findById(flowerId);
  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }

  const reviews = await Review.find({ flower: flowerId })
    .populate("reviewer", "userName")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalReviews = await Review.countDocuments({ flower: flowerId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reviews,
        totalReviews,
        averageRating: flower.averageRating,
        pages: Math.ceil(totalReviews / limit),
      },
      "Reviews fetched successfully",
    ),
  );
});

export const updateReview = async_handler(async (req, res) => {
  const userId = req.userId;
  const { reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.reviewer.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only update your own review");
  }

  // Update review
  if (rating) {
    if (rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }
    review.rating = rating;
  }
  if (title) review.title = title;
  if (comment) {
    if (comment.length < 10) {
      throw new ApiError(400, "Comment must be at least 10 characters long");
    }
    review.comment = comment;
  }

  await review.save();

  // Recalculate flower's average rating
  const flower = await Flower.findById(review.flower);
  const allReviews = await Review.find({ flower: review.flower });
  const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
  flower.averageRating = totalRating / allReviews.length;
  await flower.save();

  const populatedReview = await review.populate("reviewer", "userName");

  await flushAll();

  return res
    .status(200)
    .json(new ApiResponse(200, populatedReview, "Review updated successfully"));
});

export const deleteReview = async_handler(async (req, res) => {
  const userId = req.userId;
  const { reviewId } = req.params; //from url

  const review = await Review.findById(reviewId);
  const userRole = req.user?.role || "user";

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Check if user is the review author or admin

  if (!userRole && review.reviewer.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete your own review");
  }

  const flowerId = review.flower;

  // Delete review
  await Review.findByIdAndDelete(reviewId);

  // Remove review from flower's reviews array and recalculate rating
  const flower = await Flower.findById(flowerId);
  flower.reviews = flower.reviews.filter((r) => r.toString() !== reviewId);

  const allReviews = await Review.find({ flower: flowerId });
  if (allReviews.length > 0) {
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    flower.averageRating = totalRating / allReviews.length;
    flower.totalReviews = allReviews.length;
  } else {
    flower.averageRating = 0;
    flower.totalReviews = 0;
  }

  await flower.save();

  await flushAll();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully"));
});
