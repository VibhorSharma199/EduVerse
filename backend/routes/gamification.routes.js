import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  getBadges,
  getUserBadges,
  checkAndAwardBadges,
  getAchievements,
  getUserAchievements,
  checkAndAwardAchievements,
  getLeaderboard,
  createBadge,
  createAchievement,
} from "../controllers/gamification.controller.js";
import {
  validateBadge,
  validateAchievement,
} from "../validators/gamification.validator.js";

const router = express.Router();

// Badge routes
router.get("/badges", getBadges);
router.get("/users/:userId/badges", protect, getUserBadges);
router.post("/badges/check", protect, checkAndAwardBadges);
router.post("/badges", protect, authorize("admin"), validateBadge, createBadge);

// Achievement routes
router.get("/achievements", getAchievements);
router.get("/users/:userId/achievements", protect, getUserAchievements);
router.post("/achievements/check", protect, checkAndAwardAchievements);
router.post(
  "/achievements",
  protect,
  authorize("admin"),
  validateAchievement,
  createAchievement
);

// Leaderboard routes
router.get("/leaderboard", getLeaderboard);

export default router;
