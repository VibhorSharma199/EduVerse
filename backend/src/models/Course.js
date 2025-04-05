import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["programming", "design", "business", "marketing", "other"],
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    lessons: [
      {
        title: String,
        content: String,
        duration: Number,
        youtubeUrl: String,
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    prerequisites: [String],
    objectives: [String],
  },
  {
    timestamps: true,
  }
);

// Calculate average rating before saving
courseSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = sum / this.ratings.length;
    this.totalRatings = this.ratings.length;
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
