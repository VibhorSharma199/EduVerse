import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import MentorDashboard from "./pages/MentorDashboard";
import CourseForm from "./pages/CourseForm";
import ModuleManagement from "./pages/ModuleManagement";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import CourseManagement from "./pages/CourseManagement";
import ModulePage from "./pages/ModulePage";
import LearningQuests from "./components/learningquests/Quests";
import Quizes from "./components/quizes/quizes";
import Badges from "./components/badges/badges";
import DiscussionForum from "./components/forums/Forums";
import ChatBot from "./components/chatbot/ChatBot";
import MyCourses from "./pages/MyCourses";
import Mentors from "./pages/Mentors";
import LecturePage from "./pages/LecturePage";
import QuizPage from "./pages/QuizPage";

const globalStyles = {
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  html: {
    WebkitOverflowScrolling: "touch",
    scrollBehavior: "smooth",
  },
  body: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  "#root": {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  "input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 30px white inset",
  },
  "::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "::-webkit-scrollbar-track": {
    background: "#f1f1f1",
    borderRadius: "4px",
  },
  "::-webkit-scrollbar-thumb": {
    background: "#c1c1c1",
    borderRadius: "4px",
    "&:hover": {
      background: "#a8a8a8",
    },
  },
};

const App = () => {
  const [showChatBot, setShowChatBot] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <AuthProvider>
        <Router>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar onChatClick={() => setShowChatBot(true)} />
            <main style={{ flex: 1, padding: "20px 0" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route
                  path="/courses/:courseId/modules/:moduleId"
                  element={
                    <PrivateRoute allowedRoles={["student", "mentor"]}>
                      <ModulePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/courses/:courseId/modules/:moduleId/lectures/:lectureId"
                  element={
                    <PrivateRoute allowedRoles={["student", "mentor"]}>
                      <LecturePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/courses/:courseId/modules/:moduleId/quiz"
                  element={
                    <PrivateRoute allowedRoles={["student", "mentor"]}>
                      <QuizPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mentor-dashboard"
                  element={
                    <PrivateRoute allowedRoles={["mentor"]}>
                      <MentorDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mentor/courses/new"
                  element={
                    <PrivateRoute allowedRoles={["mentor"]}>
                      <CourseForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mentor/courses/:courseId/edit"
                  element={
                    <PrivateRoute allowedRoles={["mentor"]}>
                      <CourseForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mentor/courses/:courseId/modules"
                  element={
                    <PrivateRoute allowedRoles={["mentor"]}>
                      <ModuleManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route path="/learning-quests" element={<LearningQuests />} />
                <Route path="/quizes" element={<Quizes />} />
                <Route path="/badges" element={<Badges />} />
                <Route path="/discussion-forum" element={<DiscussionForum />} />
                <Route
                  path="/leaderboard"
                  element={
                    <PrivateRoute>
                      <Leaderboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/chatbot"
                  element={
                    <PrivateRoute>
                      <ChatBot />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mentor/courses"
                  element={
                    <PrivateRoute allowedRoles={["mentor"]}>
                      <CourseManagement />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-courses"
                  element={
                    <PrivateRoute allowedRoles={["student"]}>
                      <MyCourses />
                    </PrivateRoute>
                  }
                />
                <Route path="/mentors" element={<Mentors />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mentor/courses/create"
                  element={
                    <PrivateRoute allowedRoles={["mentor", "admin"]}>
                      <CourseForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create-course"
                  element={
                    <PrivateRoute allowedRoles={["mentor", "admin"]}>
                      <CourseForm />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
