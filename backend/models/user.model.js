import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },
    mentorStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profilePicture: {
      type: String,
      default: "default-avatar.png",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    skills: [
      {
        type: String,
      },
    ],
    points: {
      type: Number,
      default: 0,
    },
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
    learningProgress: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        completed: {
          type: Boolean,
          default: false,
        },
        progress: {
          type: Number,
          default: 0,
        },
        lastAccessed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Get signed JWT token
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", UserSchema);

export default User;
