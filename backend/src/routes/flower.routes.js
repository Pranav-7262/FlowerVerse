import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getAllFlowers,
  getFlowerById,
  getMyFlowers,
  createFlower,
  updateFlower,
  deleteFlower,
} from "../controllers/flower.controller.js";

const router = express.Router();

router.get("/", getAllFlowers);
router.get("/my", verifyJWT, getMyFlowers);
router.get("/:flowerId", getFlowerById);

router.post("/create-flower", verifyJWT, createFlower);
router.patch("/update-flower/:flowerId", verifyJWT, updateFlower);
router.delete("/delete-flower/:flowerId", verifyJWT, deleteFlower);

export default router;
