const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const Achievement = require("../models/Achievement");
const UserAchievement = require("../models/UserAchievement");
const User = require("../models/User");

// Get all badges
router.get("/badges", async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true });
    res.json({
      status: "success",
      data: badges,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch badges",
    });
  }
});

// Get user's badges
router.get("/users/badges", auth, async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user: req.user._id })
      .populate("badge")
      .sort({ earnedAt: -1 });

    const badges = await Badge.find({ isActive: true });
    const earnedBadgeIds = new Set(
      userBadges.map((ub) => ub.badge._id.toString())
    );

    const allBadges = badges.map((badge) => ({
      ...badge.toObject(),
      earned: earnedBadgeIds.has(badge._id.toString()),
      earnedAt: userBadges.find(
        (ub) => ub.badge._id.toString() === badge._id.toString()
      )?.earnedAt,
    }));

    res.json({
      status: "success",
      data: allBadges,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user badges",
    });
  }
});

// Get user's achievements
router.get("/users/achievements", auth, async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({ user: req.user._id })
      .populate("achievement")
      .sort({ completedAt: -1 });

    const achievements = await Achievement.find({ isActive: true });
    const completedAchievementIds = new Set(
      userAchievements.map((ua) => ua.achievement._id.toString())
    );

    const allAchievements = achievements.map((achievement) => {
      const userAchievement = userAchievements.find(
        (ua) => ua.achievement._id.toString() === achievement._id.toString()
      );

      return {
        ...achievement.toObject(),
        completed: completedAchievementIds.has(achievement._id.toString()),
        completedAt: userAchievement?.completedAt,
        progress: userAchievement?.progress || 0,
      };
    });

    res.json({
      status: "success",
      data: allAchievements,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user achievements",
    });
  }
});

// Check and award badges for course completion
router.post("/badges/check-course/:courseId", auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    // Get user's course progress
    const user = await User.findById(userId).populate("enrolledCourses");
    const course = user.enrolledCourses.find(
      (c) => c._id.toString() === courseId
    );

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Check for course completion badges
    const courseBadges = await Badge.find({
      type: "course_completion",
      isActive: true,
    });

    const newBadges = [];
    for (const badge of courseBadges) {
      const hasBadge = await UserBadge.findOne({
        user: userId,
        badge: badge._id,
      });

      if (!hasBadge) {
        // Check if user meets badge requirements
        const meetsRequirements = checkBadgeRequirements(badge, user, course);
        if (meetsRequirements) {
          // Award badge
          await UserBadge.create({
            user: userId,
            badge: badge._id,
            earnedAt: new Date(),
          });
          newBadges.push(badge);
        }
      }
    }

    res.json({
      status: "success",
      data: {
        newBadges,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to check badges",
    });
  }
});

// Helper function to check badge requirements
const checkBadgeRequirements = (badge, user, course) => {
  const { requirements } = badge;

  switch (badge.type) {
    case "course_completion":
      return checkCourseCompletionRequirements(requirements, user, course);
    case "streak":
      return checkStreakRequirements(requirements, user);
    case "achievement":
      return checkAchievementRequirements(requirements, user);
    default:
      return false;
  }
};

const checkCourseCompletionRequirements = (requirements, user, course) => {
  const { completedLectures, totalLectures } = course;
  const completionPercentage = (completedLectures / totalLectures) * 100;

  return completionPercentage >= requirements.minCompletionPercentage;
};

const checkStreakRequirements = (requirements, user) => {
  const { currentStreak } = user;
  return currentStreak >= requirements.minStreak;
};

const checkAchievementRequirements = (requirements, user) => {
  // Implement achievement-specific requirement checks
  return true;
};

module.exports = router;
