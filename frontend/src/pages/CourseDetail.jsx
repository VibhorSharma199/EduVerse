import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  PlayCircle as PlayCircleIcon,
  School as SchoolIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import courseService from "../services/courseService";
import { useAuth } from "../contexts/AuthContext";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details
      const courseData = await courseService.getCourse(id);
      console.log("Course data:", courseData);
      setCourse(courseData);

      // Fetch course progress if user is enrolled
      if (user) {
        try {
          // Check if the course has progress data directly
          if (courseData.progress !== undefined) {
            setProgress(courseData.progress);
          } else {
            // Try to get progress from enrolled courses
            const enrolledCourses = await courseService.getEnrolledCourses();
            const enrolledCourse = enrolledCourses.find((c) => c._id === id);
            if (enrolledCourse && enrolledCourse.progress !== undefined) {
              setProgress(enrolledCourse.progress);
            }
          }
        } catch (progressError) {
          console.warn("Could not fetch course progress:", progressError);
          // Don't set error here, just continue with progress at 0
        }
      }
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError(err.message || "Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await courseService.enrollCourse(id);
      // After enrollment, navigate to the first module if available
      if (course && course.modules && course.modules.length > 0) {
        navigate(`/courses/${id}/modules/${course.modules[0]._id}`);
      } else {
        // If no modules, just go to the course page
        navigate(`/courses/${id}`);
      }
    } catch (err) {
      setError(err.message || "Failed to enroll in course");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={() => navigate("/courses")}>
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 2 }}>
          Course not found
        </Alert>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" onClick={() => navigate("/courses")}>
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }

  const isEnrolled = course.enrolledStudents?.some(
    (student) => student._id === user?._id || student === user?._id
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Course Header */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" paragraph>
                {course.description}
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Chip
                  icon={<SchoolIcon />}
                  label={course.category || "Uncategorized"}
                  variant="outlined"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${course.duration || 0} hours`}
                  variant="outlined"
                />
                <Chip
                  icon={<PeopleIcon />}
                  label={`${course.enrolledStudents?.length || 0} students`}
                  variant="outlined"
                />
                <Chip
                  icon={<StarIcon />}
                  label={`${course.rating?.toFixed(1) || "0.0"} rating`}
                  variant="outlined"
                />
              </Box>

              {isEnrolled && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Course Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "right" }}
                  >
                    {Math.round(progress)}% Complete
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Course Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Level"
                        secondary={course.level || "Beginner"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PlayCircleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Modules"
                        secondary={course.modules?.length || 0}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Duration"
                        secondary={`${course.duration || 0} hours`}
                      />
                    </ListItem>
                  </List>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={
                      isEnrolled
                        ? () => {
                            if (course.modules && course.modules.length > 0) {
                              navigate(
                                `/courses/${id}/modules/${course.modules[0]._id}`
                              );
                            } else {
                              navigate(`/courses/${id}`);
                            }
                          }
                        : handleEnroll
                    }
                    disabled={loading}
                  >
                    {isEnrolled ? "Continue Learning" : "Enroll Now"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Course Content */}
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                What You'll Learn
              </Typography>
              <List>
                {course.learningObjectives?.map((objective, i) => (
                  <ListItem key={i}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText primary={objective} />
                  </ListItem>
                ))}
                {(!course.learningObjectives ||
                  course.learningObjectives.length === 0) && (
                  <ListItem>
                    <ListItemText primary="No learning objectives available" />
                  </ListItem>
                )}
              </List>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" gutterBottom>
                Course Modules
              </Typography>
              <List>
                {course.modules?.map((module) => (
                  <ListItem
                    key={module._id}
                    button
                    onClick={() =>
                      navigate(`/courses/${id}/modules/${module._id}`)
                    }
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <PlayCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={module.title}
                      secondary={`${module.lessons?.length || 0} lessons`}
                    />
                    <Chip
                      label={module.completed ? "Completed" : "In Progress"}
                      color={module.completed ? "success" : "primary"}
                      size="small"
                    />
                  </ListItem>
                ))}
                {(!course.modules || course.modules.length === 0) && (
                  <ListItem>
                    <ListItemText primary="No modules available yet" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Course Instructor
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={course.mentor?.avatar || "/default-avatar.png"}
                  alt={course.mentor?.name || "Instructor"}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1">
                    {course.mentor?.name || "Course Instructor"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.mentor?.title || "Course Instructor"}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {course.mentor?.bio || "No bio available"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CourseDetail;
