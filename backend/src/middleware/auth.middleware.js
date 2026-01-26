import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  try {
    // First, check the Authorization header for Bearer token
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.jwt) {
      // If no Bearer token, use the refresh token from cookies to get a new access token
      // For now, just verify it's valid
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
