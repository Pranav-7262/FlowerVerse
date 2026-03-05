import async_handler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
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
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password must match");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isOldPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  // 🔐 Prevent reusing old password
  const isSameAsOldPassword = await user.comparePassword(newPassword);
  if (isSameAsOldPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const updateUsername = async_handler(async (req, res) => {
  const { userName } = req.body;
  if (!userName) throw new ApiError(400, "Username is required");

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { userName } },
    { new: true },
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "Username updated !"));
});
export const updateEmail = async_handler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "Email already in use");
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: {
        email,
      },
    },
    { new: true },
  ).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "Email updated !"));
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

export const forgotPassword = async_handler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }
  // Generate a unique token and set expiry (e.g., 1 hour)
  const resetToken = crypto.randomBytes(32).toString("hex"); // generate random token of 32 bytes ,
  user.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); // this is to hash the token before saving to DB for security
  user.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`; // send this URL to user's email in real application , eg  http://localhost:5173/reset-password/abcdef123456
  // in development print the link so it can be manually used if email isn't configured
  if (process.env.NODE_ENV !== "production") {
    console.log("[forgotPassword] reset link:", resetUrl);
  }
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - FlowerMart",
      message: `Hello ${user.userName || "there"}!\n\nYou requested a password reset for your FlowerMart account.\n\nClick the button below to reset your password. This link will expire in 15 minutes for security reasons.\n\nIf you didn't request this password reset, please ignore this email - your password will remain unchanged.`,
      resetUrl: resetUrl,
    });
    // when running locally, return the URL so clients/tests can use it
    const responseData = {};
    if (process.env.NODE_ENV !== "production") {
      responseData.resetUrl = resetUrl;
    }
    res
      .status(200)
      .json(new ApiResponse(200, responseData, "Reset link sent to email"));
  } catch (error) {
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Email could not be sent");
  }
});

export const resetPassword = async_handler(async (req, res) => {
  const { token } = req.params; // this is the token from URL params like /reset-password/:token
  const { password } = req.body;
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // Validate password strength
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex"); // hash the incoming token to compare with DB
  const user = await User.findOne({
    forgetPasswordToken: hashedToken,
    forgetPasswordExpiry: { $gt: Date.now() },
  }); // find user with matching token and check if token is not expired

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired reset link. Please request a new password reset.",
    );
  }

  // Check if password is different from current password
  const isSamePassword = await user.isPasswordCorrect(password);
  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password",
    );
  }

  user.password = password; // set new password
  user.forgetPasswordToken = undefined; // clear the token and expiry after successful password reset
  user.forgetPasswordExpiry = undefined;
  // revoke any existing refresh token so old tokens can't be used after password change
  user.refreshToken = undefined;
  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset successfully. Please login with your new password.",
      ),
    );
});
