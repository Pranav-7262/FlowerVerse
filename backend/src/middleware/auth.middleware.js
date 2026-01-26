import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies?.jwt;
    // console.log("Auth Header:", authHeader);
    // Check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); //verify token
    // Attach user info to request
    req.userId = decoded.userId; //userId from payload
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
