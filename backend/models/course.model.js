import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a course title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: "default-course-thumbnail.jpg",
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["programming", "design", "business", "marketing", "other"],
    },
    level: {
      type: String,
      required: [true, "Please add a difficulty level"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
      },
    ],
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    prerequisites: [
      {
        type: String,
      },
    ],
    objectives: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    certificateTemplate: {
      type: String,
      default: "default-certificate-template.png",
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total duration and lectures before saving
courseSchema.pre("save", async function (next) {
  if (this.isModified("modules")) {
    const Module = mongoose.model("Module");
    const modules = await Module.find({ _id: { $in: this.modules } });

    this.totalDuration = modules.reduce(
      (total, module) => total + module.duration,
      0
    );
    this.totalLectures = modules.reduce(
      (total, module) => total + module.lectures.length,
      0
    );
  }
  next();
});

// Calculate average rating
courseSchema.methods.calculateRating = async function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating = sum / this.reviews.length;
};

const Course = mongoose.model("Course", courseSchema);

export default Course;
