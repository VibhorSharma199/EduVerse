import express from "express";
import { getDashboardData } from "../controllers/dashboard.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get dashboard data
router.get("/", protect, getDashboardData);

export default router;
