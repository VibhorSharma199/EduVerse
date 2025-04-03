import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a quiz title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: Number,
          required: true,
          min: 0,
        },
        explanation: {
          type: String,
          required: true,
        },
        points: {
          type: Number,
          default: 1,
        },
      },
    ],
    attempts: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        answers: [
          {
            questionId: String,
            selectedAnswer: Number,
            isCorrect: Boolean,
          },
        ],
        score: {
          type: Number,
          required: true,
        },
        timeTaken: {
          type: Number, // in seconds
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    passingScore: {
      type: Number,
      required: true,
      default: 70,
    },
    timeLimit: {
      type: Number, // in minutes
      default: 30,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    isRandomized: {
      type: Boolean,
      default: true,
    },
    showExplanation: {
      type: Boolean,
      default: true,
    },
    showResults: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total points before saving
quizSchema.pre("save", function (next) {
  this.totalPoints = this.questions.reduce((total, q) => total + q.points, 0);
  next();
});

// Instance method to grade quiz
quizSchema.methods.grade = async function (answers, userId) {
  let score = 0;
  const gradedAnswers = [];

  for (const answer of answers) {
    const question = this.questions.find(
      (q) => q._id.toString() === answer.questionId
    );
    if (!question) continue;

    const isCorrect = answer.selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      score += question.points;
    }

    gradedAnswers.push({
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect,
    });
  }

  const percentage = (score / this.totalPoints) * 100;
  const passed = percentage >= this.passingScore;

  // Record attempt
  this.attempts.push({
    user: userId,
    answers: gradedAnswers,
    score: percentage,
    timeTaken: answers.timeTaken || 0,
  });

  await this.save();

  return {
    score: percentage,
    passed,
    totalPoints: this.totalPoints,
    earnedPoints: score,
    answers: gradedAnswers,
  };
};

// Instance method to get user's attempts
quizSchema.methods.getAttempts = async function (userId) {
  return this.attempts.filter(
    (attempt) => attempt.user.toString() === userId.toString()
  ).length;
};

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
