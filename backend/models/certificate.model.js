import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    finalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    certificateUrl: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
    },
    metadata: {
      completionTime: Number, // in hours
      quizScores: [
        {
          quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
          },
          score: Number,
          attempts: Number,
        },
      ],
      lastAccessed: Date,
      totalModules: Number,
      completedModules: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for unique user-course combination
certificateSchema.index({ user: 1, course: 1 }, { unique: true });

// Generate unique certificate ID
certificateSchema.pre("save", async function (next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.certificateId = `CERT-${timestamp}-${random}`.toUpperCase();
  }

  if (!this.verificationCode) {
    const random = Math.random().toString(36).substring(2, 8);
    this.verificationCode = `VER-${random}`.toUpperCase();
  }

  next();
});

// Method to verify certificate authenticity
certificateSchema.methods.verify = function (code) {
  return this.verificationCode === code && this.status === "active";
};

// Method to revoke certificate
certificateSchema.methods.revoke = async function (reason) {
  this.status = "revoked";
  this.metadata.revocationReason = reason;
  this.metadata.revocationDate = new Date();
  await this.save();
};

export default mongoose.model("Certificate", certificateSchema);
