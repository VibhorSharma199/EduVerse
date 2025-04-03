import Badge from "../models/badge.model.js";
import Achievement from "../models/achievement.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

// @desc    Get all badges
// @route   GET /api/badges
// @access  Public
export const getBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find({ status: "active" }).select("-criteria");

    res.json({
      status: "success",
      data: badges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user badges
// @route   GET /api/users/:userId/badges
// @access  Private
export const getUserBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate("badges");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: user.badges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check and award badges
// @route   POST /api/badges/check
// @access  Private
export const checkAndAwardBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const badges = await Badge.find({ status: "active" });
    const newlyAwardedBadges = [];

    for (const badge of badges) {
      // Skip if user already has the badge
      if (user.badges.includes(badge._id)) continue;

      // Check if user meets badge criteria
      const meetsCriteria = await checkBadgeCriteria(user, badge);
      if (meetsCriteria) {
        user.badges.push(badge._id);
        user.points += badge.points;
        newlyAwardedBadges.push(badge);
      }
    }

    await user.save();

    res.json({
      status: "success",
      data: newlyAwardedBadges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ status: "active" }).select(
      "-requirements"
    );

    res.json({
      status: "success",
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user achievements
// @route   GET /api/users/:userId/achievements
// @access  Private
export const getUserAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "achievements"
    );

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: user.achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check and award achievements
// @route   POST /api/achievements/check
// @access  Private
export const checkAndAwardAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const achievements = await Achievement.find({ status: "active" });
    const newlyAwardedAchievements = [];

    for (const achievement of achievements) {
      // Skip if user already has the achievement
      if (user.achievements.includes(achievement._id)) continue;

      // Check if user meets achievement requirements
      const meetsRequirements = await achievement.checkRequirements(user);
      if (meetsRequirements) {
        user.achievements.push(achievement._id);
        user.points += achievement.rewards.points;

        // Award associated badges
        if (achievement.rewards.badges) {
          user.badges.push(...achievement.rewards.badges);
        }

        newlyAwardedAchievements.push(achievement);
      }
    }

    await user.save();

    res.json({
      status: "success",
      data: newlyAwardedAchievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const { timeFrame = "all", limit = 10 } = req.query;
    let query = {};

    // Apply time frame filter
    if (timeFrame !== "all") {
      const now = new Date();
      let startDate;

      switch (timeFrame) {
        case "daily":
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case "weekly":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "monthly":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0);
      }

      query.createdAt = { $gte: startDate };
    }

    const users = await User.find(query)
      .select("name profilePicture points level badges achievements")
      .populate("badges", "name icon")
      .populate("achievements", "name icon")
      .sort("-points")
      .limit(parseInt(limit));

    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to check badge criteria
const checkBadgeCriteria = async (user, badge) => {
  const { type, value, course } = badge.criteria;

  switch (type) {
    case "course_completion":
      if (!course) return false;
      const courseProgress = user.progress.get(course.toString()) || 0;
      return courseProgress >= value;

    case "quiz_score":
      const quizAttempts = user.quizAttempts || new Map();
      const quizScores = Array.from(quizAttempts.values()).filter(
        (score) => score >= value
      );
      return quizScores.length >= value;

    case "streak":
      // Implementation depends on streak tracking system
      return false;

    case "engagement":
      // Implementation depends on engagement metrics
      return false;

    case "custom":
      // Custom criteria need to be implemented per badge
      return false;

    default:
      return false;
  }
};

// @desc    Create a new badge
// @route   POST /api/badges
// @access  Private (Admin)
export const createBadge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const badge = await Badge.create(req.body);

    res.status(201).json({
      status: "success",
      data: badge,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Create a new achievement
// @route   POST /api/achievements
// @access  Private (Admin)
export const createAchievement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const achievement = await Achievement.create(req.body);

    res.status(201).json({
      status: "success",
      data: achievement,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
