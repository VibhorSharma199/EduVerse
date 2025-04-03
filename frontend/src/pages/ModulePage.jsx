import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";
import { PlayArrow as PlayArrowIcon, EmojiEvents } from "@mui/icons-material";
import mentorService from "../services/mentorService";
import gamificationService from "../services/gamificationService";

const ModulePage = () => {
  const { courseId, moduleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [badgeNotification, setBadgeNotification] = useState(null);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (course && moduleId) {
      const module = course.modules.find((m) => m._id === moduleId);
      setCurrentModule(module);
      if (module && module.lectures.length > 0) {
        setCurrentLecture(module.lectures[0]);
      }
    }
  }, [course, moduleId]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getCourseById(courseId);
      if (response.status === "success") {
        setCourse(response.data);
      }
    } catch (error) {
      setError("Failed to load course data");
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLectureSelect = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleLectureComplete = async () => {
    if (!currentLecture || completedLectures.has(currentLecture._id)) return;

    try {
      // Mark lecture as completed
      setCompletedLectures((prev) => new Set([...prev, currentLecture._id]));

      // Check for badges
      const response =
        await gamificationService.checkCourseCompletion(courseId);
      if (response.status === "success" && response.data.newBadges) {
        setBadgeNotification({
          message: `Congratulations! You've earned new badges!`,
          badges: response.data.newBadges,
        });
      }
    } catch (error) {
      console.error("Error checking badges:", error);
    }
  };

  const getEmbedUrl = (url) => {
    // Handle different YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!course || !currentModule) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Course or module not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {currentModule.title}
        </Typography>

        <Box sx={{ display: "flex", gap: 4, mt: 4 }}>
          {/* Video Player */}
          <Box sx={{ flex: 2 }}>
            {currentLecture ? (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {currentLecture.title}
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "56.25%", // 16:9 aspect ratio
                    width: "100%",
                    backgroundColor: "#000",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <iframe
                    src={getEmbedUrl(currentLecture.videoUrl)}
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
                    title={currentLecture.title}
                  />
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {currentLecture.description}
                </Typography>
                {!completedLectures.has(currentLecture._id) && (
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleLectureComplete}
                    >
                      Mark as Completed
                    </Button>
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography>Select a lecture to start learning</Typography>
              </Paper>
            )}
          </Box>

          {/* Lecture List */}
          <Box sx={{ flex: 1 }}>
            <Paper>
              <List>
                {currentModule.lectures.map((lecture, index) => (
                  <React.Fragment key={lecture._id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={currentLecture?._id === lecture._id}
                        onClick={() => handleLectureSelect(lecture)}
                      >
                        <PlayArrowIcon sx={{ mr: 1 }} />
                        <ListItemText
                          primary={`${index + 1}. ${lecture.title}`}
                          secondary={`${lecture.duration} minutes`}
                        />
                        {completedLectures.has(lecture._id) && (
                          <EmojiEvents color="primary" />
                        )}
                      </ListItemButton>
                    </ListItem>
                    {index < currentModule.lectures.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Badge Notification */}
      <Snackbar
        open={!!badgeNotification}
        autoHideDuration={6000}
        onClose={() => setBadgeNotification(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setBadgeNotification(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {badgeNotification?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ModulePage;
