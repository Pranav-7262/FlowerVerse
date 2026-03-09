import express from "express";
import {
  buyNow,
  getMyOrders,
  getSellerOrders,
  cancelOrder,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(verifyJWT);

router.post("/checkout", buyNow);
router.get("/my", getMyOrders);
router.get("/seller", getSellerOrders);

router.patch("/cancel-order/:orderId", cancelOrder);
export default router;
