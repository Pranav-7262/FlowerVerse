import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addReview,
  getFlowerReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { cacheMiddleware } from "../lib/redis.js";

const router = express.Router();

// Get all reviews for a flower (public)
router.get(
  "/:flowerId",
  cacheMiddleware({
    ttl: 300,
    keyGenerator: (req) =>
      `reviews:flower_${req.params.flowerId}:page_${req.query.page || 1}:limit_${req.query.limit || 5}`,
  }),
  getFlowerReviews,
);

// Add a review (authenticated)
router.post("/:flowerId", verifyJWT, addReview);

// Update a review (authenticated)
router.patch("/:reviewId", verifyJWT, updateReview);

// Delete a review (authenticated)
router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;
