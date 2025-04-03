import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, validateProfileUpdate, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
