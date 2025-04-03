import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResults,
  generateQuizQuestions,
} from "../controllers/quiz.controller.js";
import {
  validateQuiz,
  validateQuizSubmission,
  validateQuizGeneration,
} from "../validators/quiz.validator.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("mentor", "admin"), validateQuiz, createQuiz);

router
  .route("/:id")
  .get(protect, getQuiz)
  .patch(protect, authorize("mentor", "admin"), validateQuiz, updateQuiz)
  .delete(protect, authorize("mentor", "admin"), deleteQuiz);

router.post(
  "/generate",
  protect,
  authorize("mentor", "admin"),
  validateQuizGeneration,
  generateQuizQuestions
);

router.post("/:id/submit", protect, validateQuizSubmission, submitQuiz);

router.get("/:id/results", protect, getQuizResults);

export default router;
