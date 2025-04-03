import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a badge name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a badge description"],
    },
    icon: {
      type: String,
      required: [true, "Please add a badge icon URL"],
    },
    category: {
      type: String,
      enum: ["course", "achievement", "special"],
      required: true,
    },
    criteria: {
      type: {
        type: String,
        enum: [
          "course_completion",
          "quiz_score",
          "streak",
          "engagement",
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
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
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
  },
  {
    timestamps: true,
  }
);

// Index for badge search
badgeSchema.index({ name: "text", description: "text" });

// Method to check if user meets badge criteria
badgeSchema.methods.checkCriteria = async function (user) {
  const { type, value, course, quiz } = this.criteria;

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

    case "custom":
      // Custom criteria need to be implemented per badge
      return false;

    default:
      return false;
  }
};

export default mongoose.model("Badge", badgeSchema);
