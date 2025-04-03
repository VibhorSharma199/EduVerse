import NotificationService from "../services/notification.service.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await NotificationService.getUserNotifications(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await NotificationService.getUnreadCount(req.user.id);

    res.json({
      status: "success",
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.json({
      status: "success",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = async (req, res, next) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);

    res.json({
      status: "success",
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await NotificationService.deleteNotification(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
