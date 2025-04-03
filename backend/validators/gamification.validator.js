import { body, validationResult } from "express-validator";
import Course from "../models/course.model.js";
import Badge from "../models/badge.model.js";

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

// Badge validation
export const validateBadge = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("icon")
    .notEmpty()
    .withMessage("Icon URL is required")
    .isURL()
    .withMessage("Icon must be a valid URL"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["course", "achievement", "special"])
    .withMessage("Invalid category"),

  body("criteria.type")
    .notEmpty()
    .withMessage("Criteria type is required")
    .isIn(["course_completion", "quiz_score", "streak", "engagement", "custom"])
    .withMessage("Invalid criteria type"),

  body("criteria.value")
    .notEmpty()
    .withMessage("Criteria value is required")
    .isInt({ min: 0 })
    .withMessage("Criteria value must be a positive number"),

  body("criteria.course").custom(async (value, { req }) => {
    if (req.body.criteria.type === "course_completion" && !value) {
      throw new Error("Course ID is required for course completion criteria");
    }
    if (value) {
      const course = await Course.findById(value);
      if (!course) {
        throw new Error("Course not found");
      }
    }
    return true;
  }),

  body("points")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Points must be a positive number"),

  body("level")
    .optional()
    .isIn(["bronze", "silver", "gold", "platinum"])
    .withMessage("Invalid badge level"),

  validate,
];

// Achievement validation
export const validateAchievement = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("icon")
    .notEmpty()
    .withMessage("Icon URL is required")
    .isURL()
    .withMessage("Icon must be a valid URL"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["learning", "engagement", "social", "special"])
    .withMessage("Invalid category"),

  body("requirements.type")
    .notEmpty()
    .withMessage("Requirements type is required")
    .isIn([
      "course_completion",
      "quiz_score",
      "streak",
      "engagement",
      "social",
      "custom",
    ])
    .withMessage("Invalid requirements type"),

  body("requirements.value")
    .notEmpty()
    .withMessage("Requirements value is required")
    .isInt({ min: 0 })
    .withMessage("Requirements value must be a positive number"),

  body("requirements.course").custom(async (value, { req }) => {
    if (req.body.requirements.type === "course_completion" && !value) {
      throw new Error(
        "Course ID is required for course completion requirements"
      );
    }
    if (value) {
      const course = await Course.findById(value);
      if (!course) {
        throw new Error("Course not found");
      }
    }
    return true;
  }),

  body("rewards.points")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reward points must be a positive number"),

  body("rewards.badges")
    .optional()
    .isArray()
    .withMessage("Reward badges must be an array")
    .custom(async (value) => {
      if (value && value.length > 0) {
        for (const badgeId of value) {
          const badge = await Badge.findById(badgeId);
          if (!badge) {
            throw new Error(`Badge with ID ${badgeId} not found`);
          }
        }
      }
      return true;
    }),

  validate,
];
