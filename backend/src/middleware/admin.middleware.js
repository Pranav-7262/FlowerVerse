import { ApiError } from "../lib/ApiError.js";

export const verifyAdmin = (req, res, next) => {
  try {
    const user = req.user; // user set by auth middleware

    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }

    if (user.role !== "admin") {
      throw new ApiError(403, "Forbidden: Admin access required");
    }

    next();
  } catch (error) {
    res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      message: error.message || "Admin verification failed",
      success: false,
    });
  }
};

export default verifyAdmin;
