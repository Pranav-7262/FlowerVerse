import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); // Protect all cart routes with JWT verification

router.get("/", getCart); // Get current user's cart
router.post("/add", addToCart);
router.patch("/update", updateCartItem);
router.delete("/remove/:flowerId", removeFromCart); // Remove item from cart
router.delete("/clear-cart", clearCart);

export default router;
