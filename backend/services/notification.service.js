import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import WebSocketService from "./websocket.service.js";

class NotificationService {
  constructor(websocketService) {
    this.websocketService = websocketService;
  }

  // Create and send notification
  async createNotification(userId, type, title, message, data = {}) {
    try {
      // Create notification in database
      const notification = await Notification.create({
        user: userId,
        type,
        title,
        message,
        data,
      });

      // Send real-time notification
      this.websocketService.sendNotification(userId, notification);

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Course enrollment notification
  async sendEnrollmentNotification(userId, courseId, courseTitle) {
    return this.createNotification(
      userId,
      "course_enrollment",
      "Course Enrolled",
      `You have successfully enrolled in ${courseTitle}`,
      { courseId }
    );
  }

  // Course completion notification
  async sendCompletionNotification(userId, courseId, courseTitle) {
    return this.createNotification(
      userId,
      "course_completion",
      "Course Completed",
      `Congratulations! You have completed ${courseTitle}`,
      { courseId }
    );
  }

  // Quiz result notification
  async sendQuizResultNotification(userId, quizId, score, passingScore) {
    const status = score >= passingScore ? "passed" : "failed";
    return this.createNotification(
      userId,
      "quiz_result",
      "Quiz Result",
      `You have ${status} the quiz with a score of ${score}%`,
      { quizId, score, status }
    );
  }

  // Badge earned notification
  async sendBadgeNotification(userId, badgeId, badgeName) {
    return this.createNotification(
      userId,
      "badge_earned",
      "Badge Earned",
      `Congratulations! You have earned the ${badgeName} badge`,
      { badgeId }
    );
  }

  // Achievement unlocked notification
  async sendAchievementNotification(userId, achievementId, achievementName) {
    return this.createNotification(
      userId,
      "achievement_unlocked",
      "Achievement Unlocked",
      `Congratulations! You have unlocked the ${achievementName} achievement`,
      { achievementId }
    );
  }

  // Certificate generated notification
  async sendCertificateNotification(userId, certificateId, courseTitle) {
    return this.createNotification(
      userId,
      "certificate_generated",
      "Certificate Generated",
      `Your certificate for ${courseTitle} has been generated`,
      { certificateId }
    );
  }

  // Get user notifications
  async getUserNotifications(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ user: userId })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ user: userId });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
  }

  // Mark all notifications as read
  async markAllAsRead(userId) {
    return Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    return Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });
  }

  // Get unread notifications count
  async getUnreadCount(userId) {
    return Notification.countDocuments({
      user: userId,
      read: false,
    });
  }
}

export default NotificationService;
