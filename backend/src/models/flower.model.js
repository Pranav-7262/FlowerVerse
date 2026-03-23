import mongoose from "mongoose";

const flowerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Roses",
        "Tulips",
        "Daisies",
        "Lilies",
        "Orchids",
        "Sunflowers",
        "Lotus",
        "Hibiscus",
        "Jasmines",
        "Marigolds",
        "Carnations",
        "Mixed Bouquets",
      ],
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Flower = mongoose.model("Flower", flowerSchema);
export default Flower;
