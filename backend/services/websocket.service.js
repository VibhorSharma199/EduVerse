import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
      },
    });

    this.connectedUsers = new Map();
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
          return next(new Error("User not found"));
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.user.name}`);

      // Store connected user
      this.connectedUsers.set(socket.user._id.toString(), socket.id);

      // Join user's personal room
      socket.join(`user:${socket.user._id}`);

      // Handle course enrollment notifications
      socket.on("join-course", (courseId) => {
        socket.join(`course:${courseId}`);
      });

      // Handle module progress updates
      socket.on("module-progress", (data) => {
        this.io.to(`course:${data.courseId}`).emit("progress-update", {
          userId: socket.user._id,
          moduleId: data.moduleId,
          progress: data.progress,
        });
      });

      // Handle quiz submissions
      socket.on("quiz-submission", (data) => {
        this.io.to(`course:${data.courseId}`).emit("quiz-result", {
          userId: socket.user._id,
          quizId: data.quizId,
          score: data.score,
        });
      });

      // Handle chat messages
      socket.on("chat-message", (data) => {
        this.io.to(`course:${data.courseId}`).emit("new-message", {
          userId: socket.user._id,
          userName: socket.user.name,
          message: data.message,
          timestamp: new Date(),
        });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user.name}`);
        this.connectedUsers.delete(socket.user._id.toString());
      });
    });
  }

  // Send notification to specific user
  sendNotification(userId, notification) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit("notification", notification);
    }
  }

  // Broadcast to all users in a course
  broadcastToCourse(courseId, event, data) {
    this.io.to(`course:${courseId}`).emit(event, data);
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users in a course
  getConnectedUsersInCourse(courseId) {
    const courseSockets = this.io.sockets.adapter.rooms.get(
      `course:${courseId}`
    );
    return courseSockets ? courseSockets.size : 0;
  }
}

export default WebSocketService;
