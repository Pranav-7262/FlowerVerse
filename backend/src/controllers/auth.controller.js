import async_handler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../lib/ApiError.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import { generateAccessToken, generateRefreshToken } from "../lib/utils.js";

export const registerUser = async_handler(async (req, res) => {
  const { userName, email, password } = req.body;

  if ([userName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const isExitsUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (isExitsUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const user = await User.create({
    email,
    userName,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export const loginUser = async_handler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [
      { userName: userName?.toLowerCase() },
      { email: email?.toLowerCase() },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id); // generate refresh token and save in db

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  res.cookie("jwt", refreshToken, {
    // set refresh token in httpOnly cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "User logged in successfully",
    ),
  );
});
// User logs in → receives:
// Access token in response JSON
// Refresh token in httpOnly cookie

export const refreshAccessToken = async_handler(async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new ApiError(403, "Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.userId !== String(user._id)) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      throw new ApiError(403, "Invalid refresh token");
    }
    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken }, //`send new access token in response
        "Access token refreshed",
      ),
    );
  } catch (err) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    throw new ApiError(403, "Invalid or expired refresh token");
  }
});

export const getCurrentUser = async_handler(async (req, res) => {
  const findUser = await User.findById(req.userId).select(
    "-password -refreshToken",
  );
  if (!findUser) {
    throw new ApiError(401, "User Not found !!");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: findUser }, "User fetched successfully"),
    );
});
// Call /refresh after login, when refresh token cookie exists
// Backend verifies cookie → generates new access token
// Frontend receives new access token in JSON → refresh token cookie remains
// Use the new access token for API calls
export const logoutUser = async_handler(async (req, res) => {
  const refreshToken = req.cookies?.jwt;

  if (refreshToken) {
    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });
    if (user) {
      // Remove refresh token from DB
      user.refreshToken = null;
      await user.save();
    }
  }
  // Clear the cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export const updateProfile = async_handler(async (req, res) => {
  const userId = req.userId; // get current user
  const { userName, password } = req.body; // no compulsion to update all fields
  const userData = {};
  if (userName) {
    userData.userName = userName;
  }
  if (password) {
    userData.password = password;
  }
  const updatedUser = await User.findByIdAndUpdate(userId, userData, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
