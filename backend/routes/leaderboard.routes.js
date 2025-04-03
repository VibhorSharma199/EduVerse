import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getTopLearners,
  getTopMentors,
  getCourseLeaderboard,
  getMonthlyLeaderboard,
  getGlobalLeaderboard,
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Public
router.get("/global", getGlobalLeaderboard);

// @desc    Get top learners
// @route   GET /api/leaderboard/learners
// @access  Public
router.get("/learners", getTopLearners);

// @desc    Get top mentors
// @route   GET /api/leaderboard/mentors
// @access  Public
router.get("/mentors", getTopMentors);

// @desc    Get course-specific leaderboard
// @route   GET /api/leaderboard/course/:courseId
// @access  Public
router.get("/course/:courseId", getCourseLeaderboard);

// @desc    Get monthly leaderboard
// @route   GET /api/leaderboard/monthly
// @access  Public
router.get("/monthly", getMonthlyLeaderboard);

export default router;
