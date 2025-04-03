import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc    Get top learners
// @route   GET /api/leaderboard/learners
// @access  Private
export const getTopLearners = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "student" })
    .select("name profilePicture points completedCourses")
    .sort("-points")
    .limit(10);

  const leaderboard = await Promise.all(
    users.map(async (user) => {
      const completedCourses = await Course.find({
        _id: { $in: user.completedCourses },
      }).select("title");

      return {
        userId: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
        points: user.points,
        completedCourses: completedCourses.length,
      };
    })
  );

  res.status(200).json({
    status: "success",
    data: leaderboard,
  });
});

// @desc    Get top mentors
// @route   GET /api/leaderboard/mentors
// @access  Private
export const getTopMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: "mentor", mentorStatus: "approved" })
    .select("name profilePicture skills bio")
    .sort("-points")
    .limit(10);

  const leaderboard = await Promise.all(
    mentors.map(async (mentor) => {
      const courses = await Course.find({
        mentor: mentor._id,
      }).select("title enrolledStudents");

      return {
        mentorId: mentor._id,
        name: mentor.name,
        profilePicture: mentor.profilePicture,
        skills: mentor.skills,
        bio: mentor.bio,
        points: mentor.points,
        totalStudents: courses.reduce(
          (acc, course) => acc + course.enrolledStudents.length,
          0
        ),
        totalCourses: courses.length,
      };
    })
  );

  res.status(200).json({
    status: "success",
    data: leaderboard,
  });
});

// @desc    Get user's rank
// @route   GET /api/leaderboard/rank
// @access  Private
export const getUserRank = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  const usersWithHigherPoints = await User.countDocuments({
    points: { $gt: user.points },
  });

  const rank = usersWithHigherPoints + 1;

  res.status(200).json({
    status: "success",
    data: {
      rank,
      points: user.points,
      totalUsers: await User.countDocuments(),
    },
  });
});

// @desc    Get weekly leaderboard
// @route   GET /api/leaderboard/weekly
// @access  Private
export const getWeeklyLeaderboard = asyncHandler(async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const users = await User.find({
    "weeklyPoints.updatedAt": { $gte: oneWeekAgo },
  })
    .select("name profilePicture weeklyPoints")
    .sort("-weeklyPoints.points")
    .limit(10);

  const leaderboard = users.map((user) => ({
    userId: user._id,
    name: user.name,
    profilePicture: user.profilePicture,
    points: user.weeklyPoints.points,
    lastUpdated: user.weeklyPoints.updatedAt,
  }));

  res.status(200).json({
    status: "success",
    data: leaderboard,
  });
});

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Public
export const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ role: "student" })
      .select("name profilePicture points level badges achievements")
      .populate("badges", "name icon")
      .populate("achievements", "name icon")
      .sort({ points: -1 })
      .limit(100);

    res.json({
      status: "success",
      data: users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        profilePicture: user.profilePicture,
        points: user.points,
        level: user.level,
        badges: user.badges,
        achievements: user.achievements,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course-specific leaderboard
// @route   GET /api/leaderboard/course/:courseId
// @access  Public
export const getCourseLeaderboard = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    const users = await User.find({
      "learningProgress.course": course._id,
    })
      .select("name profilePicture points level")
      .sort({ "learningProgress.progress": -1 })
      .limit(100);

    res.json({
      status: "success",
      data: users.map((user, index) => {
        const progress = user.learningProgress.find(
          (lp) => lp.course.toString() === course._id.toString()
        );
        return {
          rank: index + 1,
          name: user.name,
          profilePicture: user.profilePicture,
          points: user.points,
          level: user.level,
          progress: progress ? progress.progress : 0,
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly leaderboard
// @route   GET /api/leaderboard/monthly
// @access  Public
export const getMonthlyLeaderboard = async (req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const users = await User.aggregate([
      {
        $match: {
          role: "student",
          "learningProgress.lastAccessed": { $gte: startOfMonth },
        },
      },
      {
        $project: {
          name: 1,
          profilePicture: 1,
          points: 1,
          level: 1,
          monthlyProgress: {
            $sum: "$learningProgress.progress",
          },
        },
      },
      { $sort: { monthlyProgress: -1 } },
      { $limit: 100 },
    ]);

    res.json({
      status: "success",
      data: users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        profilePicture: user.profilePicture,
        points: user.points,
        level: user.level,
        monthlyProgress: user.monthlyProgress,
      })),
    });
  } catch (error) {
    next(error);
  }
};
