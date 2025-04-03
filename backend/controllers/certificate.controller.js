import Certificate from "../models/certificate.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

// @desc    Generate certificate for course completion
// @route   POST /api/certificates/generate
// @access  Private
export const generateCertificate = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Validate course exists and user is enrolled
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    const user = await User.findById(userId);
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        status: "error",
        message: "User is not enrolled in this course",
      });
    }

    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      user: userId,
      course: courseId,
    });

    if (existingCertificate) {
      return res.status(400).json({
        status: "error",
        message: "Certificate already exists for this course",
      });
    }

    // Calculate final score and grade
    const courseProgress = user.progress.get(courseId.toString()) || 0;
    const finalScore = Math.round(courseProgress);
    let grade;

    if (finalScore >= 90) grade = "A";
    else if (finalScore >= 80) grade = "B";
    else if (finalScore >= 70) grade = "C";
    else if (finalScore >= 60) grade = "D";
    else grade = "F";

    // Create certificate
    const certificate = await Certificate.create({
      user: userId,
      course: courseId,
      grade,
      finalScore,
      completionDate: new Date(),
      issueDate: new Date(),
      status: "active",
    });

    // Populate certificate with user and course details
    await certificate.populate([
      { path: "user", select: "name email" },
      { path: "course", select: "title description" },
    ]);

    res.status(201).json({
      status: "success",
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user certificates
// @route   GET /api/users/:userId/certificates
// @access  Private
export const getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.params.userId })
      .populate("course", "title description")
      .sort("-issueDate");

    res.json({
      status: "success",
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificate by ID or verification code
// @route   GET /api/certificates/:identifier
// @access  Public
export const getCertificate = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const certificate = await Certificate.findOne({
      $or: [
        { _id: identifier },
        { certificateId: identifier },
        { verificationCode: identifier },
      ],
    }).populate([
      { path: "user", select: "name email" },
      { path: "course", select: "title description" },
    ]);

    if (!certificate) {
      return res.status(404).json({
        status: "error",
        message: "Certificate not found",
      });
    }

    res.json({
      status: "success",
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:verificationCode
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      verificationCode: req.params.verificationCode,
    }).populate([
      { path: "user", select: "name email" },
      { path: "course", select: "title description" },
    ]);

    if (!certificate) {
      return res.status(404).json({
        status: "error",
        message: "Certificate not found",
      });
    }

    const isValid = await certificate.verify();

    res.json({
      status: "success",
      data: {
        isValid,
        certificate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke certificate
// @route   PATCH /api/certificates/:id/revoke
// @access  Private (Admin only)
export const revokeCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        status: "error",
        message: "Certificate not found",
      });
    }

    await certificate.revoke(req.body.reason);

    res.json({
      status: "success",
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download certificate
// @route   GET /api/certificates/:id/download
// @access  Private
export const downloadCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        status: "error",
        message: "Certificate not found",
      });
    }

    // Check if user is authorized to download
    if (
      certificate.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to download this certificate",
      });
    }

    // TODO: Implement certificate PDF generation
    // For now, return the certificate URL if it exists
    if (!certificate.certificateUrl) {
      return res.status(400).json({
        status: "error",
        message: "Certificate PDF not available",
      });
    }

    res.json({
      status: "success",
      data: {
        downloadUrl: certificate.certificateUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
