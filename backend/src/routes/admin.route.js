import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import {
  changeUserRole,
  getAllUsers,
  getUserStats,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/admin.controller.js";
import { cacheMiddleware } from "../lib/redis.js";

const router = express.Router();
router.get(
  "/users",
  verifyJWT,
  verifyAdmin,
  cacheMiddleware({
    ttl: 300,
    keyGenerator: (req) =>
      `users:page_${req.query.page || 1}:limit_${req.query.limit || 10}:role_${req.query.role || ""}:search_${req.query.search || ""}`,
  }),
  getAllUsers,
);
router.patch("/users/:userId/role", verifyJWT, verifyAdmin, changeUserRole);
router.get(
  "/stats/users",
  verifyJWT,
  verifyAdmin,
  cacheMiddleware({ ttl: 600, keyGenerator: () => "admin_user_stats" }),
  getUserStats,
);
router.patch(
  "/orders/:orderId/status",
  verifyJWT,
  verifyAdmin,
  updateOrderStatus,
);
router.get(
  "/orders",
  verifyJWT,
  verifyAdmin,
  cacheMiddleware({ ttl: 600, keyGenerator: () => "all_orders" }),
  getAllOrders,
);

export default router;
