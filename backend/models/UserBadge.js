const mongoose = require("mongoose");

const userBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can't earn the same badge twice
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

module.exports = mongoose.model("UserBadge", userBadgeSchema);
