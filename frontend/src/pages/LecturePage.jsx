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
import moduleService from "../services/moduleService";

const LecturePage = () => {
  const { courseId, moduleId, lectureId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchLectureData();
  }, [courseId, moduleId, lectureId]);

  const fetchLectureData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch module data
      const moduleData = await moduleService.getModule(courseId, moduleId);
      setModule(moduleData);

      // Find the lecture in the module
      const lectureData = moduleData.lectures?.find((l) => l._id === lectureId);

      if (!lectureData) {
        throw new Error("Lecture not found");
      }

      setLecture(lectureData);

      // Set progress based on lecture completion
      setProgress(
        lectureData.completed || lectureData.progress === 100 ? 100 : 0
      );
    } catch (err) {
      console.error("Error fetching lecture data:", err);
      setError(err.message || "Failed to load lecture data");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLecture = async () => {
    try {
      setLoading(true);
      await moduleService.completeLecture(courseId, moduleId, lectureId);
      await fetchLectureData();

      // Navigate to next lecture if available
      const currentLectureIndex = module.lectures.findIndex(
        (l) => l._id === lectureId
      );
      if (currentLectureIndex < module.lectures.length - 1) {
        const nextLecture = module.lectures[currentLectureIndex + 1];
        navigate(
          `/courses/${courseId}/modules/${moduleId}/lectures/${nextLecture._id}`
        );
      } else {
        // If this is the last lecture, go back to module page
        navigate(`/courses/${courseId}/modules/${moduleId}`);
      }
    } catch (err) {
      setError(err.message || "Failed to complete lecture");
    } finally {
      setLoading(false);
    }
  };

  const navigateToNextLecture = () => {
    const currentLectureIndex = module.lectures.findIndex(
      (l) => l._id === lectureId
    );
    if (currentLectureIndex < module.lectures.length - 1) {
      const nextLecture = module.lectures[currentLectureIndex + 1];
      navigate(
        `/courses/${courseId}/modules/${moduleId}/lectures/${nextLecture._id}`
      );
    }
  };

  const navigateToPreviousLecture = () => {
    const currentLectureIndex = module.lectures.findIndex(
      (l) => l._id === lectureId
    );
    if (currentLectureIndex > 0) {
      const previousLecture = module.lectures[currentLectureIndex - 1];
      navigate(
        `/courses/${courseId}/modules/${moduleId}/lectures/${previousLecture._id}`
      );
    }
  };

  const getYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
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
            onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}`)}
            startIcon={<ArrowBackIcon />}
          >
            Back to Module
          </Button>
        </Box>
      </Container>
    );
  }

  if (!lecture) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 2 }}>
          Lecture not found
        </Alert>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}`)}
            startIcon={<ArrowBackIcon />}
          >
            Back to Module
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Lecture Header */}
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
              onClick={() =>
                navigate(`/courses/${courseId}/modules/${moduleId}`)
              }
            >
              Back to Module
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={navigateToPreviousLecture}
                disabled={
                  !module.lectures ||
                  module.lectures.findIndex((l) => l._id === lectureId) === 0
                }
              >
                Previous Lecture
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={navigateToNextLecture}
                disabled={
                  !module.lectures ||
                  module.lectures.findIndex((l) => l._id === lectureId) ===
                    module.lectures.length - 1
                }
              >
                Next Lecture
              </Button>
            </Box>
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            {lecture.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            {lecture.description}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`${lecture.duration || 0} minutes`}
              variant="outlined"
            />
            <Chip
              icon={<CheckCircleIcon />}
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
              variant="outlined"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Lecture Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Paper>

        {/* Lecture Content */}
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              {lecture.youtubeUrl && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Video Content
                  </Typography>
                  <Box
                    sx={{
                      position: "relative",
                      paddingTop: "56.25%", // 16:9 aspect ratio
                      width: "100%",
                      bgcolor: "black",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(lecture.youtubeUrl)}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </Box>
                </Box>
              )}

              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={handleCompleteLecture}
                  disabled={loading || progress === 100}
                  startIcon={<CheckCircleIcon />}
                >
                  {progress === 100 ? "Lecture Completed" : "Mark as Complete"}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Lecture Resources
              </Typography>
              <List>
                {lecture.resources?.map((resource, index) => (
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
                {(!lecture.resources || lecture.resources.length === 0) && (
                  <ListItem>
                    <ListItemText primary="No resources available" />
                  </ListItem>
                )}
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>
                Module Progress
              </Typography>
              <List>
                {module.lectures?.map((l) => (
                  <ListItem
                    key={l._id}
                    button
                    onClick={() =>
                      navigate(
                        `/courses/${courseId}/modules/${moduleId}/lectures/${l._id}`
                      )
                    }
                    sx={{
                      bgcolor:
                        l._id === lectureId ? "action.selected" : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      <PlayCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={l.title} secondary={l.description} />
                    <Chip
                      label={
                        l.completed || l.progress === 100
                          ? "Completed"
                          : "In Progress"
                      }
                      color={
                        l.completed || l.progress === 100
                          ? "success"
                          : "primary"
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LecturePage;
