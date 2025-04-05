import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import mentorService from "../services/mentorService";

const CourseForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    level: "beginner",
    category: "",
    thumbnail: "",
    status: "draft",
  });

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getCourseById(courseId);
      if (response.status === "success") {
        const course = response.data;
        setFormData({
          title: course.title,
          description: course.description,
          price: course.price,
          level: course.level,
          category: course.category,
          thumbnail: course.thumbnail,
          status: course.status,
        });
      }
    } catch (error) {
      setError("Failed to load course data");
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (courseId) {
        await mentorService.updateCourse(courseId, formData);
      } else {
        await mentorService.createCourse(formData);
      }

      navigate("/mentor/dashboard");
    } catch (error) {
      setError(error.message || "Failed to save course");
      console.error("Error saving course:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && courseId) {
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

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {courseId ? "Edit Course" : "Create New Course"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: "$",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Level</InputLabel>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  label="Level"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Thumbnail URL"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/mentor/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : courseId
                      ? "Update Course"
                      : "Create Course"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default CourseForm;
