import Course from "../models/Course.js";
import User from "../models/User.js";
import Badge from "../models/Badge.js";
import Achievement from "../models/Achievement.js";

// Get all badges
export const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json({
      status: "success",
      data: badges,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get all achievements
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json({
      status: "success",
      data: achievements,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Check course completion and award badges
export const checkCourseCompletion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Get course and user
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).json({
        status: "error",
        message: "Course or user not found",
      });
    }

    // Check if user is enrolled in the course
    const isEnrolled = course.enrolledStudents.includes(userId);
    if (!isEnrolled) {
      return res.status(400).json({
        status: "error",
        message: "User is not enrolled in this course",
      });
    }

    // Check course completion
    const progress = user.courseProgress.find(
      (p) => p.courseId.toString() === courseId
    );

    if (!progress || !progress.completed) {
      return res.json({
        status: "success",
        message: "Course not completed yet",
        data: {
          completed: false,
          badges: [],
          achievements: [],
        },
      });
    }

    // Check for badges
    const badges = await Badge.find({
      criteria: {
        $elemMatch: {
          type: "course_completion",
          courseId: courseId,
        },
      },
    });

    // Check for achievements
    const achievements = await Achievement.find({
      criteria: {
        $elemMatch: {
          type: "course_completion",
          courseId: courseId,
        },
      },
    });

    // Award badges and achievements
    const awardedBadges = [];
    const awardedAchievements = [];

    for (const badge of badges) {
      if (!user.badges.includes(badge._id)) {
        user.badges.push(badge._id);
        awardedBadges.push(badge);
      }
    }

    for (const achievement of achievements) {
      if (!user.achievements.includes(achievement._id)) {
        user.achievements.push(achievement._id);
        awardedAchievements.push(achievement);
      }
    }

    if (awardedBadges.length > 0 || awardedAchievements.length > 0) {
      await user.save();
    }

    res.json({
      status: "success",
      message: "Course completion checked",
      data: {
        completed: true,
        badges: awardedBadges,
        achievements: awardedAchievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Mark course as completed and check for badges/achievements
export const markCourseCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Get course and user
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).json({
        status: "error",
        message: "Course or user not found",
      });
    }

    // Check if user is enrolled in the course
    const isEnrolled = course.enrolledStudents.includes(userId);
    if (!isEnrolled) {
      return res.status(400).json({
        status: "error",
        message: "User is not enrolled in this course",
      });
    }

    // Update course progress
    const progressIndex = user.courseProgress.findIndex(
      (p) => p.courseId.toString() === courseId
    );

    if (progressIndex === -1) {
      user.courseProgress.push({
        courseId,
        completed: true,
        completedAt: new Date(),
      });
    } else {
      user.courseProgress[progressIndex].completed = true;
      user.courseProgress[progressIndex].completedAt = new Date();
    }

    await user.save();

    // Check for badges and achievements
    const badges = await Badge.find({
      criteria: {
        $elemMatch: {
          type: "course_completion",
          courseId: courseId,
        },
      },
    });

    const achievements = await Achievement.find({
      criteria: {
        $elemMatch: {
          type: "course_completion",
          courseId: courseId,
        },
      },
    });

    // Award badges and achievements
    const awardedBadges = [];
    const awardedAchievements = [];

    for (const badge of badges) {
      if (!user.badges.includes(badge._id)) {
        user.badges.push(badge._id);
        awardedBadges.push(badge);
      }
    }

    for (const achievement of achievements) {
      if (!user.achievements.includes(achievement._id)) {
        user.achievements.push(achievement._id);
        awardedAchievements.push(achievement);
      }
    }

    if (awardedBadges.length > 0 || awardedAchievements.length > 0) {
      await user.save();
    }

    res.json({
      status: "success",
      message: "Course marked as completed",
      data: {
        courseId,
        completed: true,
        badges: awardedBadges,
        achievements: awardedAchievements,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
