import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "course_enrollment",
        "course_completion",
        "quiz_result",
        "badge_earned",
        "achievement_unlocked",
        "certificate_generated",
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

// Methods
notificationSchema.methods.markAsRead = async function () {
  this.read = true;
  return this.save();
};

// Static methods
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({ user: userId, read: false });
};

// Virtuals
notificationSchema.virtual("isRecent").get(function () {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return this.createdAt >= oneDayAgo;
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
