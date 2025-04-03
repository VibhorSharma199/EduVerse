import { uploadToCloud } from "../utils/cloudStorage.js";

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        status: "error",
        message: "File must be an image",
      });
    }

    // Upload to cloud storage
    const result = await uploadToCloud(req.file, "images");

    res.json({
      status: "success",
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload video
// @route   POST /api/upload/video
// @access  Private
export const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith("video/")) {
      return res.status(400).json({
        status: "error",
        message: "File must be a video",
      });
    }

    // Upload to cloud storage
    const result = await uploadToCloud(req.file, "videos");

    res.json({
      status: "success",
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload document
// @route   POST /api/upload/document
// @access  Private
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid document type",
      });
    }

    // Upload to cloud storage
    const result = await uploadToCloud(req.file, "documents");

    res.json({
      status: "success",
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    next(error);
  }
};
