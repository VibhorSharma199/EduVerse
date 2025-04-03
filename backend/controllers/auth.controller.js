import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "User already exists",
      });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "learningProgress.course",
        select: "title thumbnail description mentor price",
        populate: {
          path: "mentor",
          select: "name profilePicture",
        },
      })
      .populate("badges", "name icon")
      .populate("achievements", "name icon");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Transform learningProgress to include course details
    const enrolledCourses = user.learningProgress.map((progress) => ({
      course: progress.course,
      completed: progress.completed,
      progress: progress.progress,
      lastAccessed: progress.lastAccessed,
    }));

    res.json({
      status: "success",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio,
        skills: user.skills,
        points: user.points,
        level: user.level,
        badges: user.badges,
        achievements: user.achievements,
        enrolledCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, skills } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    await user.save();

    res.json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio,
        skills: user.skills,
        points: user.points,
        level: user.level,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // TODO: Send reset email
    // For now, just return the token
    res.json({
      status: "success",
      message: "Password reset token sent to email",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Get user by token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset token",
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};
