import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addReview,
  getRecommendedCourses,
  getFeaturedCourses,
  getMentorCourses,
} from "../controllers/course.controller.js";
import {
  validateCourse,
  validateReview,
} from "../validators/course.validator.js";

const router = express.Router();

// Base routes
router
  .route("/")
  .get(getCourses)
  .post(protect, authorize("mentor", "admin"), validateCourse, createCourse);

// Featured courses route (must come before :id route)
router.get("/featured", getFeaturedCourses);

// Recommended courses route (must come before :id route)
router.get("/recommended", protect, getRecommendedCourses);

// Get mentor's courses
router.get("/mentor", protect, authorize("mentor"), getMentorCourses);

// Course-specific routes
router
  .route("/:id")
  .get(getCourse)
  .patch(protect, authorize("mentor", "admin"), validateCourse, updateCourse)
  .delete(protect, authorize("mentor", "admin"), deleteCourse);

// Course actions
router.post("/:id/enroll", protect, enrollCourse);
router.post("/:id/review", protect, validateReview, addReview);

export default router;
