// Import routes
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import userRoutes from "./routes/user.routes.js";
import gamificationRoutes from "./routes/gamification.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gamification", gamificationRoutes);
