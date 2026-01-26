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

router.post("/checkout", buyNow); //here we will place order
router.get("/my", getMyOrders); //here we will get orders for the logged in buyer
router.get("/seller", getSellerOrders); //here we will get orders for the logged in seller

//for cancel order we can create another route if needed
router.patch("/cancel-order/:orderId", cancelOrder);
export default router;
