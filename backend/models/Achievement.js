const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "course_completion",
        "learning_streak",
        "quiz_performance",
        "community_engagement",
      ],
    },
    requirements: {
      type: Object,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Achievement", achievementSchema);
