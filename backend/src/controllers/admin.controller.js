import async_handler from "express-async-handler";
import { ApiError } from "../lib/ApiError.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import User from "../models/user.model.js";

export const getAllUsers = async_handler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query; // eg like ?page=1&limit=10&role=admin&search=john

  let filter = {};

  // Filter by role if provided
  if (role && ["customer", "admin"].includes(role)) {
    filter.role = role;
  }

  // Search by userName or email
  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .select("-password -refreshToken -forgetPasswordToken")
    .limit(parseInt(limit))
    .skip(skip)
    .sort({ createdAt: -1 });

  const totalUsers = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          limit: parseInt(limit),
        },
      },
      "Users fetched successfully",
    ),
  );
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

  const updatedUser = await User.findById(userId).select(
    "-password -refreshToken -forgetPasswordToken",
  );
  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, `User role updated to ${role}`));
});

export const getUserStats = async_handler(async (req, res) => {
  const totalUsers = await User.countDocuments(); // total number of users in the system
  const adminUsers = await User.countDocuments({ role: "admin" }); // total number of admin users in the system
  const customerUsers = await User.countDocuments({ role: "customer" });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        adminUsers,
        customerUsers,
      },
      "User statistics fetched successfully",
    ),
  );
});
