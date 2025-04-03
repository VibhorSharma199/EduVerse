import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});

// @desc    Update user profile
// @route   PATCH /api/user/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// @desc    Get user's enrolled courses
// @route   GET /api/user/enrolled-courses
// @access  Private
export const getUserEnrolledCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ enrolledStudents: req.user._id })
    .populate("mentor", "name profilePicture")
    .sort("-enrolledAt");

  res.status(200).json({
    status: "success",
    results: courses.length,
    data: courses,
  });
});

// @desc    Get user's progress
// @route   GET /api/user/progress
// @access  Private
export const getUserProgress = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({
    enrolledStudents: req.user._id,
  }).populate("modules.lectures.completedBy", "name");

  const progress = courses.map((course) => {
    const totalLectures = course.modules.reduce(
      (acc, module) => acc + module.lectures.length,
      0
    );
    const completedLectures = course.modules.reduce(
      (acc, module) =>
        acc +
        module.lectures.filter((lecture) =>
          lecture.completedBy.some(
            (user) => user._id.toString() === req.user._id.toString()
          )
        ).length,
      0
    );

    return {
      courseId: course._id,
      courseTitle: course.title,
      progress: (completedLectures / totalLectures) * 100,
      completedLectures,
      totalLectures,
    };
  });

  res.status(200).json({
    status: "success",
    data: progress,
  });
});

// @desc    Get user's certificates
// @route   GET /api/user/certificates
// @access  Private
export const getUserCertificates = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({
    enrolledStudents: req.user._id,
    "certificates.issuedTo": req.user._id,
  }).select("title certificates.$");

  const certificates = courses.map((course) => ({
    courseId: course._id,
    courseTitle: course.title,
    certificate: course.certificates[0],
  }));

  res.status(200).json({
    status: "success",
    results: certificates.length,
    data: certificates,
  });
});
