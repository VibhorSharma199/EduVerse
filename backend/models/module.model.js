import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a module title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    lectures: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        youtubeUrl: {
          type: String,
          required: true,
        },
        duration: {
          type: Number, // in minutes
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate module duration before saving
moduleSchema.pre("save", function (next) {
  this.duration = this.lectures.reduce(
    (total, lecture) => total + lecture.duration,
    0
  );
  next();
});

// Update course total duration when module is updated
moduleSchema.post("save", async function () {
  const Course = mongoose.model("Course");
  await Course.findByIdAndUpdate(this.course, {
    $set: { modules: this._id },
  });
});

const Module = mongoose.model("Module", moduleSchema);

export default Module;
