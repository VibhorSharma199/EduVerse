import courseRoutes from "./routes/course.routes.js";
import gamificationRoutes from "./routes/gamification.routes.js";

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/gamification", gamificationRoutes);
