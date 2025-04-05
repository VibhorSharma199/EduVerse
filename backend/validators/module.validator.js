import { body, validationResult } from "express-validator";

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.array(),
    });
  }
  next();
};

// Module validation
export const validateModule = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("course")
    .trim()
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid course ID"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a positive number"),

  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Invalid status"),

  body("prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array"),

  validate,
];

// Lecture validation
export const validateLecture = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("youtubeUrl")
    .trim()
    .notEmpty()
    .withMessage("YouTube URL is required")
    .isURL()
    .withMessage("YouTube URL must be a valid URL"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 0 })
    .withMessage("Duration must be a positive number"),

  body("thumbnail")
    .optional()
    .isURL()
    .withMessage("Thumbnail must be a valid URL"),

  body("resources")
    .optional()
    .isArray()
    .withMessage("Resources must be an array"),

  validate,
];
