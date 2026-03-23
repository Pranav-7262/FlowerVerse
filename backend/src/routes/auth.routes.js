import express from "express";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  updateEmail,
  updateUsername,
  changeCurrentPassword,
  resetAccount,
  forgotPassword,
  resetPassword,
  // addAdress,
  GetAdress,
  UpdateAdress,
  DeleteAdress,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken); // this route having no auth middleware , because it's purpose is to get new access token using refresh token
router.post("/logout", verifyJWT, logoutUser);

router.get("/current-user", verifyJWT, getCurrentUser);
router.put("/update-username", verifyJWT, updateUsername);
router.put("/update-email", verifyJWT, updateEmail);
router.put("/update-password", verifyJWT, changeCurrentPassword);
router.delete("/reset-account", verifyJWT, resetAccount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// router.post("/add-address", verifyJWT, addAdress);
router.put("/update-address", verifyJWT, UpdateAdress);
router.delete("/delete-address", verifyJWT, DeleteAdress);
router.get("/get-address", verifyJWT, GetAdress);
export default router;
