import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createModule,
  getModule,
  updateModule,
  deleteModule,
  addLecture,
  updateLecture,
  deleteLecture,
  updateProgress,
} from "../controllers/module.controller.js";
import {
  validateModule,
  validateLecture,
} from "../validators/module.validator.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("mentor", "admin"), validateModule, createModule);

router
  .route("/:id")
  .get(protect, getModule)
  .patch(protect, authorize("mentor", "admin"), validateModule, updateModule)
  .delete(protect, authorize("mentor", "admin"), deleteModule);

// Lecture routes
router
  .route("/:id/lectures")
  .post(protect, authorize("mentor", "admin"), validateLecture, addLecture);

router
  .route("/:id/lectures/:lectureId")
  .patch(protect, authorize("mentor", "admin"), validateLecture, updateLecture)
  .delete(protect, authorize("mentor", "admin"), deleteLecture);

// Progress tracking
router.post("/:id/progress", protect, updateProgress);

export default router;
