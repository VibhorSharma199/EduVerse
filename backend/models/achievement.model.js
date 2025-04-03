import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add an achievement name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add an achievement description"],
    },
    icon: {
      type: String,
      required: [true, "Please add an achievement icon URL"],
    },
    category: {
      type: String,
      enum: ["learning", "engagement", "social", "special"],
      required: true,
    },
    requirements: {
      type: {
        type: String,
        enum: [
          "course_completion",
          "quiz_score",
          "streak",
          "engagement",
          "social",
          "custom",
        ],
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    },
    rewards: {
      points: {
        type: Number,
        default: 0,
      },
      badges: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Badge",
        },
      ],
      special: {
        type: String,
      },
    },
    isSecret: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    unlockDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for achievement search
achievementSchema.index({ name: "text", description: "text" });

// Method to check if user meets achievement requirements
achievementSchema.methods.checkRequirements = async function (user) {
  const { type, value, course, quiz } = this.requirements;

  switch (type) {
    case "course_completion":
      if (!course) return false;
      const courseProgress = user.progress.get(course.toString()) || 0;
      return courseProgress >= value;

    case "quiz_score":
      if (!quiz) return false;
      const quizAttempts = user.quizAttempts || new Map();
      const quizScore = quizAttempts.get(quiz.toString()) || 0;
      return quizScore >= value;

    case "streak":
      // Implementation depends on streak tracking system
      return false;

    case "engagement":
      // Implementation depends on engagement metrics
      return false;

    case "social":
      // Implementation depends on social metrics
      return false;

    case "custom":
      // Custom requirements need to be implemented per achievement
      return false;

    default:
      return false;
  }
};

export default mongoose.model("Achievement", achievementSchema);
