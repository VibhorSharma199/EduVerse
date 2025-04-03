import express from "express";
import * as courseController from "../controllers/courseController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourse);

// Protected routes
router.use(protect);

// Student routes
router.post("/:id/enroll", courseController.enrollCourse);
router.post("/:id/rate", courseController.rateCourse);

// Instructor routes
router.post("/", authorize("instructor"), courseController.createCourse);
router.put("/:id", authorize("instructor"), courseController.updateCourse);
router.delete("/:id", authorize("instructor"), courseController.deleteCourse);

export default router;
