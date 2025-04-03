import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";
import Signup from "./components/Signup";
import LearningQuests from "./components/learningquests/Quests";
import Quizes from "./components/quizes/quizes";
import Badges from "./components/badges/badges";
import CareerGrowth from "./components/growth/CareerGrowth";
import DiscussionForum from "./components/forums/Forums";
import LeaderBoard from "./components/leaderboard/Leaderboard";
import ChatBot from "./components/chatbot/ChatBot";
import ModulePage from "./pages/ModulePage";
import MentorDashboard from "./pages/MentorDashboard";
import ModuleManagement from "./pages/ModuleManagement";
import CourseManagement from "./pages/CourseManagement";
import CourseForm from "./pages/CourseForm";
import MyCourses from "./pages/MyCourses";
import Mentors from "./pages/Mentors";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
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
                path="/mentor/dashboard"
                element={
                  <PrivateRoute allowedRoles={["mentor"]}>
                    <MentorDashboard />
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
              <Route path="/signup" element={<Signup />} />
              <Route path="/learning-quests" element={<LearningQuests />} />
              <Route path="/quizes" element={<Quizes />} />
              <Route path="/badges" element={<Badges />} />
              <Route path="/career-growth" element={<CareerGrowth />} />
              <Route path="/discussion-forum" element={<DiscussionForum />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
              <Route path="/chatbot" element={<ChatBot />} />
              <Route
                path="/mentor/courses"
                element={
                  <PrivateRoute allowedRoles={["mentor"]}>
                    <CourseManagement />
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
                path="/mentor/courses/:id/edit"
                element={
                  <PrivateRoute allowedRoles={["mentor"]}>
                    <CourseForm />
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
                  <PrivateRoute allowedRoles={["student", "mentor"]}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
