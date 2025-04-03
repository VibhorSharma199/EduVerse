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

// Course validation
export const validateCourse = [
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
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "programming",
      "design",
      "business",
      "marketing",
      "languages",
      "other",
    ])
    .withMessage("Invalid category"),

  body("level")
    .trim()
    .notEmpty()
    .withMessage("Level is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Invalid level"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("thumbnail")
    .optional()
    .isURL()
    .withMessage("Thumbnail must be a valid URL"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("prerequisites")
    .optional()
    .isArray()
    .withMessage("Prerequisites must be an array"),

  validate,
];

// Review validation
export const validateReview = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Comment must be between 10 and 500 characters"),

  validate,
];
