import express from "express";
import {
  buyNow,
  getMyOrders,
  getSellerOrders,
  cancelOrder,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();
router.use(verifyJWT);

router.post("/checkout", buyNow);
router.get("/my", getMyOrders); // Customer's purchases
router.get("/seller", verifyAdmin, getSellerOrders); // Admin/Seller's sales

router.patch("/cancel-order/:orderId", cancelOrder);
export default router;
