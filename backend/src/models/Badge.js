const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["course", "quiz", "profile", "social", "other"],
    },
    requirements: {
      type: Map,
      of: Number,
      default: {},
    },
    points: {
      type: Number,
      required: true,
      min: 0,
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

// Static method to check if user qualifies for a badge
badgeSchema.statics.checkEligibility = async function (userId, category) {
  const user = await mongoose.model("User").findById(userId);
  if (!user) return null;

  const badges = await this.find({ category, isActive: true });
  const eligibleBadges = [];

  for (const badge of badges) {
    let isEligible = true;
    for (const [requirement, value] of badge.requirements) {
      switch (requirement) {
        case "coursesCompleted":
          if (user.enrolledCourses.length < value) isEligible = false;
          break;
        case "quizzesPassed":
          if (user.quizResults.filter((q) => q.passed).length < value)
            isEligible = false;
          break;
        case "profileCompletion":
          if (user.profileCompletion < value) isEligible = false;
          break;
        case "socialPoints":
          if (user.socialPoints < value) isEligible = false;
          break;
        default:
          isEligible = false;
      }
      if (!isEligible) break;
    }

    if (isEligible && !user.badges.includes(badge._id)) {
      eligibleBadges.push(badge);
    }
  }

  return eligibleBadges;
};

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;
