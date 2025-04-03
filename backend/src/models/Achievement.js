const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
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
    rarity: {
      type: String,
      required: true,
      enum: ["common", "rare", "epic", "legendary"],
    },
  },
  {
    timestamps: true,
  }
);

// Static method to check if user qualifies for an achievement
achievementSchema.statics.checkEligibility = async function (userId, category) {
  const user = await mongoose.model("User").findById(userId);
  if (!user) return null;

  const achievements = await this.find({ category, isActive: true });
  const eligibleAchievements = [];

  for (const achievement of achievements) {
    let isEligible = true;
    for (const [requirement, value] of achievement.requirements) {
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
        case "badgesEarned":
          if (user.badges.length < value) isEligible = false;
          break;
        case "achievementsEarned":
          if (user.achievements.length < value) isEligible = false;
          break;
        default:
          isEligible = false;
      }
      if (!isEligible) break;
    }

    if (isEligible && !user.achievements.includes(achievement._id)) {
      eligibleAchievements.push(achievement);
    }
  }

  return eligibleAchievements;
};

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
