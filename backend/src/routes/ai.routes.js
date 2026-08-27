import express from "express";
import { projectSearch } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(verifyJWT);
router.post("/flower-assistant", projectSearch);

export default router;
