import Course from "../models/Course.js";
import User from "../models/User.js";
import Badge from "../models/Badge.js";
import Achievement from "../models/Achievement.js";
import { validateObjectId } from "../utils/validation.js";

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;
    let query = { status: "published" };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .populate("enrolledStudents", "name email")
      .select(
        "title description instructor category level price duration lessons enrolledStudents ratings averageRating totalRatings status thumbnail prerequisites objectives"
      )
      .sort({ createdAt: -1 });

    console.log("Found courses:", courses.length); // Debug log

    res.json({
      status: "success",
      data: courses,
    });
  } catch (error) {
    console.error("Error in getAllCourses:", error); // Debug log
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get single course
export const getCourse = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email")
      .populate("enrolledStudents", "name email");

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
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Create course
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
    });

    // Update instructor's courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { courses: course._id },
    });

    res.status(201).json({
      status: "success",
      data: course,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
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
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this course",
      });
    }

    await course.remove();

    // Remove course from instructor's courses
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { courses: course._id },
    });

    res.json({
      status: "success",
      message: "Course deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Enroll in course
export const enrollCourse = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({
        status: "error",
        message: "Already enrolled in this course",
      });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Update user's enrolled courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id },
    });

    // Check for badge/achievement eligibility
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    const enrolledCoursesCount = user.enrolledCourses.length;

    // Check for course completion badge
    if (enrolledCoursesCount >= 5) {
      const badge = await Badge.findOne({ name: "Course Explorer" });
      if (badge && !user.badges.includes(badge._id)) {
        user.badges.push(badge._id);
        await user.save();
      }
    }

    // Check for course completion achievement
    if (enrolledCoursesCount >= 10) {
      const achievement = await Achievement.findOne({ name: "Course Master" });
      if (achievement && !user.achievements.includes(achievement._id)) {
        user.achievements.push(achievement._id);
        await user.save();
      }
    }

    res.json({
      status: "success",
      message: "Successfully enrolled in course",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Rate course
export const rateCourse = async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid course ID",
      });
    }

    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    if (!course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({
        status: "error",
        message: "Must be enrolled to rate this course",
      });
    }

    const existingRating = course.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      course.ratings.push({
        user: req.user._id,
        rating,
        review,
      });
    }

    await course.save();

    res.json({
      status: "success",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
