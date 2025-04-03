import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Get all mentors
// @route   GET /api/mentors
// @access  Public
export const getMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({
    role: "mentor",
    mentorStatus: "approved",
  })
    .select("name profilePicture bio skills points level")
    .populate("badges", "name icon")
    .sort({ points: -1 });

  res.json({
    status: "success",
    data: mentors,
  });
});

// @desc    Get mentor profile
// @route   GET /api/mentors/:id
// @access  Public
export const getMentorProfile = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.params.id)
    .select("name profilePicture bio skills points level mentorStatus")
    .populate("badges", "name icon")
    .populate("achievements", "name icon");

  if (!mentor || mentor.role !== "mentor") {
    return res.status(404).json({
      status: "error",
      message: "Mentor not found",
    });
  }

  res.json({
    status: "success",
    data: mentor,
  });
});

// @desc    Update mentor profile
// @route   PUT /api/mentors/profile
// @access  Private (Mentor)
export const updateMentorProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bio, skills } = req.body;
  const mentor = await User.findById(req.user.id);

  if (bio) mentor.bio = bio;
  if (skills) mentor.skills = skills;

  await mentor.save();

  res.json({
    status: "success",
    data: {
      id: mentor._id,
      name: mentor.name,
      email: mentor.email,
      profilePicture: mentor.profilePicture,
      bio: mentor.bio,
      skills: mentor.skills,
      points: mentor.points,
      level: mentor.level,
    },
  });
});

// @desc    Get mentor's courses
// @route   GET /api/mentors/:id/courses
// @access  Public
export const getMentorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ mentor: req.params.id })
    .select("title thumbnail description price rating enrolledStudents")
    .populate("modules")
    .sort("-createdAt");

  res.json({
    status: "success",
    data: courses.map((course) => ({
      id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      description: course.description,
      price: course.price,
      rating: course.rating,
      students: course.enrolledStudents.length,
      modules: course.modules.length,
    })),
  });
});

// @desc    Get mentor statistics
// @route   GET /api/mentor/stats
// @access  Private (Mentor)
export const getMentorStats = asyncHandler(async (req, res) => {
  const courses = await Course.find({ mentor: req.user._id });

  const stats = {
    totalStudents: courses.reduce(
      (acc, course) => acc + course.enrolledStudents.length,
      0
    ),
    totalRevenue: courses.reduce((acc, course) => {
      const price = course.price * (1 - course.discount / 100);
      return acc + price * course.enrolledStudents.length;
    }, 0),
    averageRating:
      courses.reduce((acc, course) => acc + (course.rating || 0), 0) /
      (courses.length || 1),
    totalCourses: courses.length,
  };

  res.status(200).json({
    status: "success",
    data: stats,
  });
});
