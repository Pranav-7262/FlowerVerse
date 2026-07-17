import async_handler from "express-async-handler";
import { ApiError } from "../lib/ApiError.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import { deleteCache, flushAll, getCache, setCache } from "../lib/redis.js";

export const getAllUsers = async_handler(async (req, res) => {
  const { page = 1, limit = 10, role = "", search = "" } = req.query;

  const cacheKey = `users:page_${page}:limit_${limit}:role_${role}:search_${search}`;

  const cachedData = await getCache(cacheKey);
  if (cachedData) {
    console.log(`✅ Cache HIT: ${cacheKey}`);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cachedData,
          "Users fetched successfully (from cache)",
        ),
      );
  }

  let filter = {};
  if (role && ["customer", "admin"].includes(role)) {
    filter.role = role;
  }

  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(filter)
    .select("-password -refreshToken -forgetPasswordToken")
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / parseInt(limit));

  const responseData = {
    users,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalUsers,
      limit: parseInt(limit),
    },
  };

  // 2. Set cache for 5 minutes (300 seconds)
  await setCache(cacheKey, responseData, 300);

  res
    .status(200)
    .json(new ApiResponse(200, responseData, "Users fetched successfully"));
});

export const changeUserRole = async_handler(async (req, res) => {
  const { userId } = req.params; // eg like userid in /users/:userId/role
  const { role } = req.body;

  // Validate role
  if (!["customer", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'customer' or 'admin'");
  }

  // Prevent admin from demoting themselves
  if (req.user._id.toString() === userId && role === "customer") {
    throw new ApiError(400, "Cannot demote yourself from admin role");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role = role;
  await user.save();
  await deleteCache("admin_user_stats");
  const updatedUser = await User.findById(userId).select(
    "-password -refreshToken -forgetPasswordToken",
  );
  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, `User role updated to ${role}`));
});

export const getUserStats = async_handler(async (req, res) => {
  const cacheKey = "admin_user_stats";

  const cachedStats = await getCache(cacheKey);
  if (cachedStats) {
    console.log(`✅ Cache HIT: ${cacheKey}`);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cachedStats,
          "Dashboard statistics fetched successfully (from cache)",
        ),
      );
  }

  const totalUsers = await User.countDocuments();
  const adminUsers = await User.countDocuments({ role: "admin" });
  const customerUsers = await User.countDocuments({
    $or: [{ role: "customer" }, { role: { $exists: false } }, { role: "" }],
  });
  const orderStats = await Order.aggregate([
    { $match: { status: { $ne: "CANCELLED" } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);
  const revenueData = orderStats[0] || { totalRevenue: 0, totalOrders: 0 };

  const statsData = {
    totalUsers,
    adminUsers,
    customerUsers,
    totalOrders: revenueData.totalOrders,
    totalRevenue: revenueData.totalRevenue,
  };

  // Cache dashboard aggregations for 10 minutes
  await setCache(cacheKey, statsData, 600);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        statsData,
        "Dashboard statistics fetched successfully",
      ),
    );
});

export const updateOrderStatus = async_handler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status transition");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true },
  ).populate("buyer", "userName email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  await deleteCache("all_orders"); // Invalidate orders cache
  await deleteCache("admin_user_stats"); // Invalidate dashboard stats cache
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        `Order status updated to ${status} successfully`,
      ),
    );
});

export const getAllOrders = async_handler(async (req, res) => {
  const cachekey = "all_orders";
  const cahchedOrders = await getCache(cachekey);
  if (cahchedOrders) {
    console.log(`✅ Cache HIT: ${cachekey}`);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cahchedOrders,
          "All global orders fetched successfully",
        ),
      );
  }
  const orders = await Order.find()
    .populate("buyer", "userName email")
    .populate("items.flower", "name price image")
    .sort({ createdAt: -1 }); // Sort by creation date in descending order

  await setCache(cachekey, orders, 600); // Cache for 10 minutes

  if (!orders || orders.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No orders found"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, "All global orders fetched successfully"),
    );
});
