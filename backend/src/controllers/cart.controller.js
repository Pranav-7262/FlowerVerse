import async_handler from "express-async-handler";
import Cart from "../models/cart.model.js";
import { ApiError } from "../lib/ApiError.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import Flower from "../models/flower.model.js";

export const getCart = async_handler(async (req, res) => {
  const userId = req.userId;
  const cart = await Cart.findOne({ user: userId }).populate("items.flower"); // log in users cart and flowers details

  if (!cart) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Cart is empty"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});
export const addToCart = async_handler(async (req, res) => {
  const userId = req.userId;
  const { flowerId, quantity = 1 } = req.body;

  if (!flowerId) {
    throw new ApiError(400, "Flower ID is required");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const flower = await Flower.findById(flowerId);
  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    if (quantity > flower.stock) {
      throw new ApiError(400, "Insufficient stock");
    }

    cart = await Cart.create({
      user: userId,
      items: [{ flower: flowerId, quantity }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.flower.equals(flowerId), // find the itemIndex with flowerID
    );

    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity; // updates Quantity

      if (newQuantity > flower.stock) {
        throw new ApiError(400, "Insufficient stock");
      }

      cart.items[itemIndex].quantity = newQuantity; //newQuantity added to that cart[itemIndex].quantity
    } else {
      if (quantity > flower.stock) {
        throw new ApiError(400, "Insufficient stock");
      }

      cart.items.push({ flower: flowerId, quantity });
    }
  }

  flower.stock -= quantity; // reduced stock of flower as per Buyer's quantity

  await Promise.all([cart.save(), flower.save()]); // Saved updated cart and flower data

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Flower added to cart successfully"));
});

export const updateCartItem = async_handler(async (req, res) => {
  const userId = req.userId;
  const { flowerId, quantity } = req.body;

  if (!flowerId || quantity == null) {
    throw new ApiError(400, "Flower ID and quantity are required");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const flower = await Flower.findById(flowerId);
  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }

  if (flower.stock < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find((item) => item.flower.toString() === flowerId);
  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  item.quantity = quantity;
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart item updated successfully"));
});

export const removeFromCart = async_handler(async (req, res) => {
  const userId = req.userId;
  const flowerId = req.params.flowerId;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.flower.toString() !== flowerId);

  if (cart.items.length === initialLength) {
    throw new ApiError(404, "Item not found in cart");
  }

  await cart.save();
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart"));
});

export const clearCart = async_handler(async (req, res) => {
  const userId = req.userId;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  cart.items = [];
  await cart.save();
  return res.status(200).json(new ApiResponse(200, cart, "Cleared cart"));
});
