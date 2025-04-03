import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  getMentors,
  getMentorProfile,
  updateMentorProfile,
  getMentorCourses,
  getMentorStats,
} from "../controllers/mentor.controller.js";

const router = express.Router();

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
router.get("/", getMentors);

// @desc    Get mentor profile
// @route   GET /api/mentors/:id
// @access  Public
router.get("/:id", getMentorProfile);

// @desc    Update mentor profile
// @route   PUT /api/mentors/profile
// @access  Private (Mentor)
router.put("/profile", protect, authorize("mentor"), updateMentorProfile);

// @desc    Get mentor's courses
// @route   GET /api/mentors/:id/courses
// @access  Public
router.get("/:id/courses", getMentorCourses);

// @desc    Get mentor statistics
// @route   GET /api/mentors/:id/stats
// @access  Public
router.get("/:id/stats", getMentorStats);

// Get mentor statistics
router.get("/stats", protect, authorize("mentor"), getMentorStats);

export default router;
