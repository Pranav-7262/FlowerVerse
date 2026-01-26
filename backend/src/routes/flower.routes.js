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

router.get("/", getAllFlowers); //public route to get all flowers
router.get("/my", verifyJWT, getMyFlowers); // get flowers added by logged in user
router.get("/:flowerId", getFlowerById); // get flower by id

router.post("/create-flower", verifyJWT, createFlower);
router.patch("/update-flower/:flowerId", verifyJWT, updateFlower); // update flower by id
router.delete("/delete-flower/:flowerId", verifyJWT, deleteFlower); //   delete flower by id

export default router;
