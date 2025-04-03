import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get("/user/enrolled-courses");
        setCourses(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load enrolled courses"
        );
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/courses")}
          >
            Browse Courses
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Courses
        </Typography>

        {courses.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You haven't enrolled in any courses yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/courses")}
            >
              Browse Courses
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course._id}>
                <Paper
                  sx={{
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() =>
                    navigate(
                      `/courses/${course._id}/modules/${course.modules[0]?._id}`
                    )
                  }
                >
                  <Box
                    component="img"
                    src={course.thumbnail || "/course-placeholder.jpg"}
                    alt={course.title}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 1,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {course.description}
                  </Typography>
                  <Box sx={{ mt: "auto" }}>
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {course.mentor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.modules.length} modules
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MyCourses;
