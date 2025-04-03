import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
  getUserEnrolledCourses,
  getUserProgress,
  getUserCertificates,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get user profile
router.get("/profile", protect, getUserProfile);

// Update user profile
router.patch("/profile", protect, updateUserProfile);

// Get user's enrolled courses
router.get("/enrolled-courses", protect, getUserEnrolledCourses);

// Get user's progress
router.get("/progress", protect, getUserProgress);

// Get user's certificates
router.get("/certificates", protect, getUserCertificates);

export default router;
