import async_handler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../lib/ApiError.js";
import { ApiResponse } from "../lib/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
    );
  }
};
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

  // Just return user - NO TOKENS YET
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully. Please login.",
      ),
    );
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

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const accessTokenOptions = {
    maxAge: 15 * 60 * 1000, // 15m
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // different domains at dev
    path: "/",
  };
  const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // use "none" + secure=true if cross-domain
    path: "/api/auth/refresh", // restrict refresh token exposure
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully",
      ),
    );
});

export const refreshAccessToken = async_handler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id);
    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user.refreshToken) {
      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
      throw new ApiError(401, "Refresh token expired or reused");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/refresh",
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(200, null, "Access token refreshed successfully"));
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid refresh token");
  }
});

export const logoutUser = async_handler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.userId,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    },
  );
  const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 min
    path: "/", // matches how access token was set
  };

  const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 10 * 24 * 60 * 60 * 1000, // must match original refresh token path
  };

  return res
    .status(200)
    .clearCookie("accessToken", accessTokenOptions)
    .clearCookie("refreshToken", refreshTokenOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
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
export const changeCurrentPassword = async_handler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(400, "User Does not Existed !!");
  }
  const isPasswordMatches = await user.comparePassword(oldPassword);
  if (!isPasswordMatches) {
    throw new ApiError(400, "Password does not matches original password !!");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
export const updateAccountDetails = async_handler(async (req, res) => {
  const { userName, email } = req.body;

  if (!userName || !email) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: {
        userName,
        email: email,
      },
    },
    { new: true },
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});
export const resetAccount = async_handler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account deleted successfully"));
});
