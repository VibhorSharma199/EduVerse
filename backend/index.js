import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import gamificationRoutes from "./routes/gamification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";

// Import middleware
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { protect } from "./middlewares/auth.middleware.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});
app.use(limiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EduVerse API Documentation",
      version: "1.0.0",
      description: "API documentation for the EduVerse e-learning platform",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/upload", protect, uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
  });
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `API Documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
