import async_handler from "express-async-handler";
import Flower from "../models/flower.model.js";
import { ApiError } from "../lib/ApiError.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import Order from "../models/order.model.js";

export const buyNow = async_handler(async (req, res) => {
  const buyerId = req.userId;
  const { flowerId, quantity = 1 } = req.body;

  const flower = await Flower.findById(flowerId);
  if (!flower) {
    throw new ApiError(404, "Flower not found");
  }

  if (flower.owner.toString() === buyerId) {
    throw new ApiError(403, "You cannot buy your own flower");
  }

  if (flower.stock < quantity) {
    throw new ApiError(400, "Insufficient stock");
  }

  const totalPrice = flower.price * quantity;

  // Create order first
  const order = await Order.create({
    buyer: buyerId,
    items: [
      {
        flower: flower._id,
        seller: flower.owner,
        quantity,
        priceAtPurchase: flower.price,
      },
    ],
    totalAmount: totalPrice,
  });

  // Then update stock
  flower.stock -= quantity;
  await flower.save();

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

export const getMyOrders = async_handler(async (req, res) => {
  const userId = req.userId;
  const orders = await Order.find({ buyer: userId })
    .populate("items.flower", "name image price")
    .populate("items.seller", "userName")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, orders, "My orders"));
});

export const getSellerOrders = async_handler(async (req, res) => {
  const userId = req.userId;
  const orders = await Order.find({
    "items.seller": userId,
  })
    .populate("buyer", "userName") // populate buyer details
    .populate("items.flower", "name image") // populate flower details
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, orders, "Seller orders"));
});

export const cancelOrder = async_handler(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.userId;

  const order = await Order.findOne({ _id: orderId, buyer: userId }).populate(
    "items.flower",
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status === "SHIPPED" || order.status === "DELIVERED") {
    throw new ApiError(
      400,
      "Cannot cancel an order that has already been shipped.",
    );
  }

  // Restock flowers
  for (const item of order.items) {
    if (item.flower) {
      item.flower.stock += item.quantity;
      await item.flower.save();
    }
  }

  order.status = "CANCELLED";
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});
