const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
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
      enum: ["course_completion", "achievement", "streak", "special"],
    },
    icon: {
      type: String,
      required: true,
    },
    requirements: {
      type: Object,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model("Badge", badgeSchema);
