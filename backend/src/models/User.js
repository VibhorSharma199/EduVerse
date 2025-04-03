const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    profilePicture: {
      type: String,
      default: "default-profile.jpg",
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
      },
    ],
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
      },
    ],
    progress: {
      type: Map,
      of: Number, // Course ID -> Progress percentage
      default: {},
    },
    completedLessons: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update passwordChangedAt when password is changed
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Only find active users
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Instance method to update course progress
userSchema.methods.updateCourseProgress = async function (courseId, progress) {
  this.progress.set(courseId.toString(), progress);
  await this.save();
};

// Instance method to mark lesson as completed
userSchema.methods.completeLesson = async function (courseId, lessonId) {
  const existingLesson = this.completedLessons.find(
    (lesson) =>
      lesson.course.toString() === courseId.toString() &&
      lesson.lesson.toString() === lessonId.toString()
  );

  if (!existingLesson) {
    this.completedLessons.push({
      course: courseId,
      lesson: lessonId,
    });
    await this.save();
  }
};

// Instance method to check if lesson is completed
userSchema.methods.isLessonCompleted = function (courseId, lessonId) {
  return this.completedLessons.some(
    (lesson) =>
      lesson.course.toString() === courseId.toString() &&
      lesson.lesson.toString() === lessonId.toString()
  );
};

// Instance method to get course progress
userSchema.methods.getCourseProgress = function (courseId) {
  return this.progress.get(courseId.toString()) || 0;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
