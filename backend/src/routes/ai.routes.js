import express from "express";
import {
  projectSearch,
  recommendFlowers,
} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/flower-assistant", projectSearch);
router.post("/recommend", recommendFlowers);

export default router;
