import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  checkCourseCompletion,
  getBadges,
  getAchievements,
  markCourseCompleted,
} from "../controllers/gamificationController.js";

const router = express.Router();

// Get all badges
router.get("/badges", protect, getBadges);

// Get all achievements
router.get("/achievements", protect, getAchievements);

// Check course completion and award badges
router.get("/badges/check-course/:courseId", protect, checkCourseCompletion);

// Mark course as completed and check for badges/achievements
router.post("/courses/:courseId/complete", protect, markCourseCompleted);

export default router;
