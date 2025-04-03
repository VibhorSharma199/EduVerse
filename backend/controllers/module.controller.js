import Module from "../models/module.model.js";
import Course from "../models/course.model.js";
import { validationResult } from "express-validator";

// @desc    Create module
// @route   POST /api/modules
// @access  Private (Mentor/Admin)
export const createModule = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.body.course);
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
        message: "Not authorized to create modules for this course",
      });
    }

    const module = await Module.create(req.body);

    // Add module to course
    course.modules.push(module._id);
    await course.save();

    res.status(201).json({
      status: "success",
      data: module,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get module
// @route   GET /api/modules/:id
// @access  Private
export const getModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate("course", "title description")
      .populate("lectures.quiz", "title questions");

    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    res.json({
      status: "success",
      data: module,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private (Mentor/Admin)
export const updateModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    const course = await Course.findById(module.course);

    // Check if user is course mentor or admin
    if (course.mentor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this module",
      });
    }

    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      status: "success",
      data: updatedModule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private (Mentor/Admin)
export const deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    const course = await Course.findById(module.course);

    // Check if user is course mentor or admin
    if (course.mentor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this module",
      });
    }

    // Remove module from course
    course.modules = course.modules.filter(
      (moduleId) => moduleId.toString() !== module._id.toString()
    );
    await course.save();

    await module.remove();

    res.json({
      status: "success",
      message: "Module deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add lecture to module
// @route   POST /api/modules/:id/lectures
// @access  Private (Mentor/Admin)
export const addLecture = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    const course = await Course.findById(module.course);

    // Check if user is course mentor or admin
    if (course.mentor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to add lectures to this module",
      });
    }

    module.lectures.push(req.body);
    await module.save();

    res.status(201).json({
      status: "success",
      data: module.lectures,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lecture
// @route   PUT /api/modules/:id/lectures/:lectureId
// @access  Private (Mentor/Admin)
export const updateLecture = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    const course = await Course.findById(module.course);

    // Check if user is course mentor or admin
    if (course.mentor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this lecture",
      });
    }

    const lecture = module.lectures.id(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({
        status: "error",
        message: "Lecture not found",
      });
    }

    Object.assign(lecture, req.body);
    await module.save();

    res.json({
      status: "success",
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lecture
// @route   DELETE /api/modules/:id/lectures/:lectureId
// @access  Private (Mentor/Admin)
export const deleteLecture = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    const course = await Course.findById(module.course);

    // Check if user is course mentor or admin
    if (course.mentor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this lecture",
      });
    }

    module.lectures = module.lectures.filter(
      (lecture) => lecture._id.toString() !== req.params.lectureId
    );
    await module.save();

    res.json({
      status: "success",
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update module progress
// @route   PUT /api/modules/:id/progress
// @access  Private
export const updateProgress = async (req, res, next) => {
  try {
    const { completedLectures } = req.body;
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    const user = req.user;
    const progress = (completedLectures / module.lectures.length) * 100;

    // Update user's progress for this module
    user.progress.set(module._id.toString(), progress);
    await user.save();

    res.json({
      status: "success",
      data: {
        progress,
        completedLectures,
      },
    });
  } catch (error) {
    next(error);
  }
};
