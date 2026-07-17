import express from "express";
import { recommendFlowers } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/recommend", recommendFlowers);

export default router;
