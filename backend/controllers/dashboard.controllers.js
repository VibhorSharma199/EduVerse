import express from "express";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Module from "../models/module.model.js";
import Quiz from "../models/quiz.model.js";

// Get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user data with populated fields
    const user = await User.findById(userId)
      .populate("badges")
      .populate("achievements")
      .populate("learningProgress.course");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get recommended courses based on user's skills and learning progress
    const enrolledCourseIds = user.learningProgress.map((lp) => lp.course._id);
    const recommendedCourses = await Course.find({
      category: { $in: user.skills },
      _id: { $nin: enrolledCourseIds },
    })
      .limit(5)
      .populate("mentor", "name");

    // Get enrolled courses with progress
    const enrolledCourses = await Course.find({
      _id: { $in: enrolledCourseIds },
    })
      .populate("mentor", "name")
      .populate("modules");

    // Get leaderboard data
    const leaderboard = await User.find()
      .select("name points badges achievements")
      .sort({ points: -1 })
      .limit(10)
      .populate("badges")
      .populate("achievements");

    // Get recent activity
    const recentActivity = await Promise.all([
      // Get recent course progress
      Module.find({
        "lectures.completedBy": userId,
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("course", "title"),
      // Get recent quiz attempts
      Quiz.find({
        "attempts.user": userId,
      })
        .sort({ "attempts.timestamp": -1 })
        .limit(5)
        .populate("module", "title"),
    ]);

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
          badges: user.badges,
          achievements: user.achievements,
          skills: user.skills,
          learningProgress: user.learningProgress,
        },
        recommendedCourses,
        enrolledCourses,
        leaderboard,
        recentActivity: {
          courseProgress: recentActivity[0],
          quizAttempts: recentActivity[1],
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

// Get leaderboard data
async function getLeaderboard() {
  try {
    return await User.aggregate([
      { $sort: { points: -1 } },
      { $limit: 10 },
      {
        $project: {
          "profile.name": 1,
          "profile.avatar": 1,
          points: 1,
          badges: { $slice: ["$badges", 3] },
        },
      },
    ]);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return [];
  }
}

// Get recent activity
async function getRecentActivity(userId) {
  try {
    const activities = [];

    // Get recent course progress
    const recentProgress = await User.findById(userId)
      .populate({
        path: "learningProgress.course",
        select: "title",
      })
      .select("learningProgress")
      .sort({ "learningProgress.updatedAt": -1 })
      .limit(5);

    if (recentProgress && recentProgress.learningProgress) {
      recentProgress.learningProgress.forEach((progress) => {
        activities.push({
          type: "course_progress",
          description: `Completed ${progress.course.title}`,
          timestamp: progress.updatedAt,
        });
      });
    }

    // Get recent quiz attempts
    const recentQuizzes = await Quiz.find({
      "attempts.user": userId,
    })
      .sort({ "attempts.timestamp": -1 })
      .limit(5);

    recentQuizzes.forEach((quiz) => {
      const lastAttempt = quiz.attempts[0];
      activities.push({
        type: "quiz_attempt",
        description: `Completed quiz: ${quiz.title}`,
        score: lastAttempt.score,
        timestamp: lastAttempt.timestamp,
      });
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => b.timestamp - a.timestamp);

    return activities.slice(0, 10); // Return latest 10 activities
  } catch (error) {
    console.error("Recent Activity Error:", error);
    return [];
  }
}
