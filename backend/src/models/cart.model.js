import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    flower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flower",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema], // array of cart items
  },
  { timestamps: true },
);

export const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
