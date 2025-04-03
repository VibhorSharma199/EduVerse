import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/:id/read", protect, markAsRead);
router.patch("/mark-all-read", protect, markAllAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;
