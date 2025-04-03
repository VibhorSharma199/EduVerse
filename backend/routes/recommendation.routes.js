import express from "express";
import { getRecommendations } from "../controllers/recommendation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get personalized recommendations based on student's skills
router.get("/", protect, getRecommendations);

export default router;
