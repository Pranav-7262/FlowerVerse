import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    flower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flower",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    helpful: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  { timestamps: true },
);

// Ensure one review per user per flower
reviewSchema.index({ flower: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
