import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAdmin from "../middleware/admin.middleware.js";
import {
  changeUserRole,
  getAllUsers,
  getUserStats,
} from "../controllers/admin.controller.js";

const router = express.Router();
router.get("/users", verifyJWT, verifyAdmin, getAllUsers);
router.patch("/users/:userId/role", verifyJWT, verifyAdmin, changeUserRole);
router.get("/stats/users", verifyJWT, verifyAdmin, getUserStats);

export default router;
