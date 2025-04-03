import { validationResult } from "express-validator";
import Quiz from "../models/quiz.model.js";
import Module from "../models/module.model.js";
import User from "../models/user.model.js";
import aiService from "../services/ai.service.js";

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Mentor/Admin)
export const createQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      moduleId,
      title,
      description,
      questions,
      timeLimit,
      passingScore,
      maxAttempts,
      difficulty,
      isRandomized,
      showExplanation,
      showResults,
    } = req.body;

    // Check if module exists
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({
        status: "error",
        message: "Module not found",
      });
    }

    // Check if user is authorized (mentor or admin)
    if (req.user.role !== "mentor" && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to create quizzes",
      });
    }

    // Create quiz
    const quiz = await Quiz.create({
      module: moduleId,
      title,
      description,
      questions,
      timeLimit,
      passingScore,
      maxAttempts,
      difficulty,
      isRandomized,
      showExplanation,
      showResults,
      createdBy: req.user._id,
    });

    // Add quiz to module
    module.quiz = quiz._id;
    await module.save();

    res.status(201).json({
      status: "success",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Generate quiz questions using AI
// @route   POST /api/quizzes/generate
// @access  Private (Mentor/Admin)
export const generateQuizQuestions = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    // Check if user is authorized (mentor or admin)
    if (req.user.role !== "mentor" && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to generate quiz questions",
      });
    }

    const questions = await aiService.generateQuizQuestions(
      topic,
      difficulty,
      count
    );

    res.status(200).json({
      status: "success",
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("module", "title");

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    // Get user's attempts
    const attempts = await quiz.getAttempts(req.user._id);

    // If user is not mentor/admin, remove correct answers and explanations
    if (req.user.role !== "mentor" && req.user.role !== "admin") {
      quiz.questions = quiz.questions.map((q) => ({
        ...q.toObject(),
        correctAnswer: undefined,
        explanation: quiz.showExplanation ? q.explanation : undefined,
      }));
    }

    // Randomize questions if enabled
    if (quiz.isRandomized) {
      quiz.questions = quiz.questions.sort(() => Math.random() - 0.5);
    }

    res.status(200).json({
      status: "success",
      data: {
        ...quiz.toObject(),
        attempts,
        remainingAttempts: quiz.maxAttempts - attempts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Update quiz
// @route   PATCH /api/quizzes/:id
// @access  Private (Mentor/Admin)
export const updateQuiz = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    // Check if user is authorized (mentor or admin)
    if (req.user.role !== "mentor" && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this quiz",
      });
    }

    // Update quiz
    Object.assign(quiz, req.body);
    await quiz.save();

    res.status(200).json({
      status: "success",
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Mentor/Admin)
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    // Check if user is authorized (mentor or admin)
    if (req.user.role !== "mentor" && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this quiz",
      });
    }

    // Remove quiz from module
    await Module.findByIdAndUpdate(quiz.module, {
      $pull: { quizzes: quiz._id },
    });

    await quiz.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Submit quiz
// @route   POST /api/quizzes/:id/submit
// @access  Private
export const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    // Check if user has already submitted maximum attempts
    const attempts = await quiz.getAttempts(req.user._id);
    if (attempts >= quiz.maxAttempts) {
      return res.status(400).json({
        status: "error",
        message: "Maximum attempts reached",
      });
    }

    // Check if time limit exceeded
    if (timeTaken > quiz.timeLimit * 60) {
      return res.status(400).json({
        status: "error",
        message: "Time limit exceeded",
      });
    }

    // Grade quiz
    const result = await quiz.grade({ answers, timeTaken }, req.user._id);

    // If user passes, award points and update progress
    if (result.passed) {
      const user = await User.findById(req.user._id);
      user.points += result.earnedPoints;

      // Update module progress
      const module = await Module.findById(quiz.module);
      const progress = user.learningProgress.find(
        (p) => p.course.toString() === module.course.toString()
      );
      if (progress) {
        progress.progress = Math.min(100, progress.progress + 20); // Quiz completion adds 20% progress
      }

      await user.save();
    }

    // Prepare response based on showResults setting
    const response = {
      status: "success",
      data: {
        passed: result.passed,
        score: result.score,
        totalPoints: result.totalPoints,
        earnedPoints: result.earnedPoints,
      },
    };

    if (quiz.showResults) {
      response.data.answers = result.answers.map((answer) => {
        const question = quiz.questions.find(
          (q) => q._id.toString() === answer.questionId
        );
        return {
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
          correctAnswer: question.correctAnswer,
          explanation: quiz.showExplanation ? question.explanation : undefined,
        };
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get quiz results
// @route   GET /api/quizzes/:id/results
// @access  Private
export const getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        status: "error",
        message: "Quiz not found",
      });
    }

    const userAttempts = quiz.attempts.filter(
      (attempt) => attempt.user.toString() === req.user._id.toString()
    );

    if (userAttempts.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No attempts found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        attempts: userAttempts.map((attempt) => ({
          score: attempt.score,
          timeTaken: attempt.timeTaken,
          timestamp: attempt.timestamp,
          answers: attempt.answers.map((answer) => {
            const question = quiz.questions.find(
              (q) => q._id.toString() === answer.questionId
            );
            return {
              questionId: answer.questionId,
              selectedAnswer: answer.selectedAnswer,
              isCorrect: answer.isCorrect,
              correctAnswer: question.correctAnswer,
              explanation: quiz.showExplanation
                ? question.explanation
                : undefined,
            };
          }),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
