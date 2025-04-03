const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/auth");

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

module.exports = router;
