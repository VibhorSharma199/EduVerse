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

// Quiz validation
export const validateQuiz = [
  body("moduleId")
    .notEmpty()
    .withMessage("Module ID is required")
    .isMongoId()
    .withMessage("Invalid module ID"),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required")
    .custom((questions) => {
      for (const question of questions) {
        if (!question.question) throw new Error("Question text is required");
        if (!Array.isArray(question.options) || question.options.length !== 4)
          throw new Error("Each question must have exactly 4 options");
        if (!question.correctAnswer)
          throw new Error("Correct answer is required");
      }
      return true;
    }),
  body("timeLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Time limit must be a positive integer"),
  body("passingScore")
    .isInt({ min: 0, max: 100 })
    .withMessage("Passing score must be between 0 and 100"),
  validate,
];

// Quiz submission validation
export const validateQuizSubmission = [
  body("answers")
    .isArray()
    .withMessage("Answers must be an array")
    .custom((answers) => {
      for (const answer of answers) {
        if (!answer.questionId)
          throw new Error("Question ID is required for each answer");
        if (!answer.selectedOption)
          throw new Error("Selected option is required for each answer");
      }
      return true;
    }),
  validate,
];

export const validateQuizGeneration = [
  body("topic")
    .notEmpty()
    .withMessage("Topic is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Topic must be between 3 and 100 characters"),
  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty is required")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be easy, medium, or hard"),
  body("count")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Question count must be between 1 and 20"),
];
