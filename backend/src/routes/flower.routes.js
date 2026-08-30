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
import { cacheMiddleware } from "../lib/redis.js";

const router = express.Router();
router.get(
  "/",

  cacheMiddleware({
    ttl: 300,
    keyGenerator: (req) =>
      `flowers:all:${req.query.category || "all"}:${req.query.page || 1}:${req.query.limit || 1000}`,
  }),
  getAllFlowers,
);
router.get(
  "/mixedBouquet",
  cacheMiddleware({
    ttl: 300,
    keyGenerator: (req) =>
      `mixedBouquets:${req.query.page || 1}:${req.query.limit || 10}`,
  }),
  fetchMixedBouquets,
);
router.get("/my", verifyJWT, verifyAdmin, getMyFlowers);
router.get(
  "/:flowerId",
  cacheMiddleware({
    ttl: 600,
    keyGenerator: (req) => `flower:${req.params.flowerId}`,
  }),
  getFlowerById,
);

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
