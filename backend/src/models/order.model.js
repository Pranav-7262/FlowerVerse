import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    flower: {
      // for particular flower ordered
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flower",
      required: true,
    },
    seller: {
      // seller of the flower
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceAtPurchase: {
      // price of the flower at the time of purchase
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      // user who placed the order
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema], // array of ordered items
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PLACED", "CANCELLED"],
      default: "PLACED",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
export default Order;
