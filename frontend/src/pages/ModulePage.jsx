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
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  AccessTime as AccessTimeIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import courseService from "../services/courseService";
import moduleService from "../services/moduleService";
import { useAuth } from "../contexts/AuthContext";

const ModulePage = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchModuleData();
  }, [courseId, moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course details first
      const courseData = await courseService.getCourse(courseId);
      console.log("Course data:", courseData);
      setCourse(courseData);

      // Find the module in the course data
      const moduleData = courseData.modules?.find((m) => m._id === moduleId);

      if (!moduleData) {
        throw new Error("Module not found");
      }

      console.log("Module data:", moduleData);
      setModule(moduleData);

      // Calculate progress based on completed lectures
      if (moduleData.lectures && moduleData.lectures.length > 0) {
        const completedLectures = moduleData.lectures.filter(
          (lecture) => lecture.completed || lecture.progress === 100
        ).length;
        const progressPercentage =
          (completedLectures / moduleData.lectures.length) * 100;
        setProgress(progressPercentage);
      }
    } catch (err) {
      console.error("Error fetching module data:", err);
      setError(err.message || "Failed to load module data");
    } finally {
      setLoading(false);
    }
  };

  const handleLectureClick = (lectureId) => {
    navigate(`/courses/${courseId}/modules/${moduleId}/lectures/${lectureId}`);
  };

  const handleCompleteModule = async () => {
    try {
      setLoading(true);
      // Mark all lectures as completed
      if (module.lectures && module.lectures.length > 0) {
        for (const lecture of module.lectures) {
          if (!lecture.completed && lecture.progress !== 100) {
            await moduleService.completeLecture(
              courseId,
              moduleId,
              lecture._id
            );
          }
        }
      }

      // Refresh module data
      await fetchModuleData();

      // Navigate to next module if available
      const currentModuleIndex = course.modules.findIndex(
        (m) => m._id === moduleId
      );
      if (currentModuleIndex < course.modules.length - 1) {
        const nextModule = course.modules[currentModuleIndex + 1];
        navigate(`/courses/${courseId}/modules/${nextModule._id}`);
      } else {
        // If this is the last module, go back to course page
        navigate(`/courses/${courseId}`);
      }
    } catch (err) {
      setError(err.message || "Failed to complete module");
    } finally {
      setLoading(false);
    }
  };

  const navigateToNextModule = () => {
    const currentModuleIndex = course.modules.findIndex(
      (m) => m._id === moduleId
    );
    if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1];
      navigate(`/courses/${courseId}/modules/${nextModule._id}`);
    }
  };

  const navigateToPreviousModule = () => {
    const currentModuleIndex = course.modules.findIndex(
      (m) => m._id === moduleId
    );
    if (currentModuleIndex > 0) {
      const previousModule = course.modules[currentModuleIndex - 1];
      navigate(`/courses/${courseId}/modules/${previousModule._id}`);
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
          <Button
            variant="contained"
            onClick={() => navigate(`/courses/${courseId}`)}
            startIcon={<ArrowBackIcon />}
          >
            Back to Course
          </Button>
        </Box>
      </Container>
    );
  }

  if (!module) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 2 }}>
          Module not found
        </Alert>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/courses/${courseId}`)}
            startIcon={<ArrowBackIcon />}
          >
            Back to Course
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Module Header */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/courses/${courseId}`)}
            >
              Back to Course
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={navigateToPreviousModule}
                disabled={
                  !course.modules ||
                  course.modules.findIndex((m) => m._id === moduleId) === 0
                }
              >
                Previous Module
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={navigateToNextModule}
                disabled={
                  !course.modules ||
                  course.modules.findIndex((m) => m._id === moduleId) ===
                    course.modules.length - 1
                }
              >
                Next Module
              </Button>
            </Box>
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            {module.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            {module.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`${module.duration || 0} minutes`}
              variant="outlined"
            />
            <Chip
              icon={<SchoolIcon />}
              label={`${module.lectures?.length || 0} lectures`}
              variant="outlined"
            />
            <Chip
              icon={<CheckCircleIcon />}
              label={`${Math.round(progress)}% complete`}
              color={progress === 100 ? "success" : "primary"}
              variant="outlined"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Module Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Paper>

        {/* Module Content */}
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Module Lectures
              </Typography>
              <List>
                {module.lectures?.map((lecture) => (
                  <ListItem
                    key={lecture._id}
                    button
                    onClick={() => handleLectureClick(lecture._id)}
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
                      primary={lecture.title}
                      secondary={lecture.description}
                    />
                    <Chip
                      label={
                        lecture.completed || lecture.progress === 100
                          ? "Completed"
                          : "In Progress"
                      }
                      color={
                        lecture.completed || lecture.progress === 100
                          ? "success"
                          : "primary"
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
                {(!module.lectures || module.lectures.length === 0) && (
                  <ListItem>
                    <ListItemText primary="No lectures available yet" />
                  </ListItem>
                )}
              </List>

              {module.lectures && module.lectures.length > 0 && (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleCompleteModule}
                    disabled={loading || progress < 100}
                    startIcon={<CheckCircleIcon />}
                  >
                    {progress === 100
                      ? "Complete Module"
                      : "Complete All Lectures First"}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Module Resources
              </Typography>
              <List>
                {module.resources?.map((resource, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PlayCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={resource.title}
                      secondary={resource.type}
                    />
                  </ListItem>
                ))}
                {(!module.resources || module.resources.length === 0) && (
                  <ListItem>
                    <ListItemText primary="No resources available" />
                  </ListItem>
                )}
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>
                Module Quiz
              </Typography>
              {module.quiz ? (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {module.quiz.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {module.quiz.description}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() =>
                        navigate(
                          `/courses/${courseId}/modules/${moduleId}/quiz`
                        )
                      }
                    >
                      Take Quiz
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No quiz available for this module
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ModulePage;
