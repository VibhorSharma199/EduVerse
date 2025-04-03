import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../services/api";

const MentorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const coursesResponse = await api.get("/courses/mentor");
        console.log("Courses response:", coursesResponse.data);

        if (coursesResponse.data.status === "success") {
          setCourses(coursesResponse.data.data || []);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
          setError(
            error.response.data.message ||
              "Failed to load courses. Please try again later."
          );
        } else if (error.request) {
          setError(
            "No response received from server. Please check your connection."
          );
        } else {
          setError("An error occurred while setting up the request.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "archived":
        return "default";
      default:
        return "primary";
    }
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

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1">
            My Courses
          </Typography>
          <Button
            component={Link}
            to="/mentor/courses/create"
            variant="contained"
            color="primary"
          >
            Create New Course
          </Button>
        </Box>

        {courses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="textSecondary">
              You haven't created any courses yet.
            </Typography>
            <Button
              component={Link}
              to="/mentor/courses/create"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Create Your First Course
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.thumbnail}
                    alt={course.title}
                  />
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <Chip
                          label={course.level}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={course.status}
                          size="small"
                          color={getStatusColor(course.status)}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          {course.enrolledStudents?.length || 0} students
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ⭐ {course.rating?.toFixed(1) || "0.0"}
                        </Typography>
                      </Box>
                      <Box>
                        {course.discount > 0 && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            ${course.price}
                          </Typography>
                        )}
                        <Typography variant="body1" color="primary">
                          $
                          {(
                            course.price *
                            (1 - (course.discount || 0) / 100)
                          ).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        component={Link}
                        to={`/mentor/courses/${course._id}/edit`}
                        variant="outlined"
                        fullWidth
                      >
                        Edit Course
                      </Button>
                      <Button
                        component={Link}
                        to={`/mentor/courses/${course._id}/modules`}
                        variant="contained"
                        fullWidth
                      >
                        Manage Modules
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default MentorDashboard;
