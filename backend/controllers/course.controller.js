import Course from "../models/course.model.js";
import Module from "../models/module.model.js";
import { validationResult } from "express-validator";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Mentor/Admin)
export const createCourse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const course = await Course.create({
    ...req.body,
    mentor: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: course,
  });
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    const query = { status: "published" };

    // Apply filters
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .populate("mentor", "name profilePicture")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort("-createdAt");

    const total = await Course.countDocuments(query);

    res.json({
      status: "success",
      results: courses.length,
      pagination: {
        total,
        page: page * 1,
        pages: Math.ceil(total / limit),
      },
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("mentor", "name profilePicture bio")
      .populate({
        path: "modules",
        select: "title description duration lectures",
      });

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    res.json({
      status: "success",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Mentor/Admin)
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Check if user is course mentor or admin
    if (course.mentor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this course",
      });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      status: "success",
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Mentor/Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Check if user is course mentor or admin
    if (course.mentor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this course",
      });
    }

    await course.remove();

    res.json({
      status: "success",
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        status: "error",
        message: "Already enrolled in this course",
      });
    }

    // Update course's enrolled students
    course.enrolledStudents.push(req.user.id);
    await course.save();

    // Update user's learning progress
    const user = await User.findById(req.user.id);
    user.learningProgress.push({
      course: course._id,
      completed: false,
      progress: 0,
      lastAccessed: new Date(),
    });
    await user.save();

    res.json({
      status: "success",
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add course review
// @route   POST /api/courses/:id/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    const { rating, comment } = req.body;

    // Check if already reviewed
    const alreadyReviewed = course.reviews.find(
      (review) => review.student.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        status: "error",
        message: "Course already reviewed",
      });
    }

    course.reviews.push({
      student: req.user.id,
      rating,
      comment,
    });

    await course.calculateRating();
    await course.save();

    res.status(201).json({
      status: "success",
      data: course.reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended courses
// @route   GET /api/courses/recommended
// @access  Private
export const getRecommendedCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");

    // Get user's interests based on enrolled courses
    const categories = user.enrolledCourses.map((course) => course.category);
    const uniqueCategories = [...new Set(categories)];

    // Find courses in similar categories that user hasn't enrolled in
    const recommendedCourses = await Course.find({
      category: { $in: uniqueCategories },
      _id: { $nin: user.enrolledCourses.map((course) => course._id) },
      status: "published",
    })
      .populate("mentor", "name profilePicture")
      .limit(5)
      .sort("-rating");

    res.json({
      status: "success",
      data: recommendedCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
export const getFeaturedCourses = async (req, res, next) => {
  try {
    // First try to get featured courses
    let featuredCourses = await Course.find({
      status: "published",
      isFeatured: true,
    })
      .populate("mentor", "name profilePicture")
      .limit(6);

    // If no featured courses, get top rated published courses
    if (featuredCourses.length === 0) {
      featuredCourses = await Course.find({
        status: "published",
      })
        .populate("mentor", "name profilePicture")
        .sort("-rating")
        .limit(6);
    }

    res.status(200).json({
      status: "success",
      data: featuredCourses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mentor's courses
// @route   GET /api/courses/mentor
// @access  Private (Mentor)
export const getMentorCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ mentor: req.user._id })
    .populate("mentor", "name profilePicture")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: courses.length,
    data: courses,
  });
});
