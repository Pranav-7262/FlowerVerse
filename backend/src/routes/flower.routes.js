import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import {
  getAllFlowers,
  getFlowerById,
  getMyFlowers,
  createFlower,
  updateFlower,
  deleteFlower,
  fetchMixedBouquets,
} from "../controllers/flower.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.get("/", getAllFlowers);
router.get("/mixedBouquet", fetchMixedBouquets);
router.get("/my", verifyJWT, verifyAdmin, getMyFlowers);
router.get("/:flowerId", getFlowerById);

router.post(
  "/create-flower",
  verifyJWT,
  verifyAdmin,
  upload.single("image"),
  createFlower,
);
router.patch("/update-flower/:flowerId", verifyJWT, verifyAdmin, updateFlower);
router.delete("/delete-flower/:flowerId", verifyJWT, verifyAdmin, deleteFlower);

export default router;
