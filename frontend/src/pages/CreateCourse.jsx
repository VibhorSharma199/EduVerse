import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Alert,
} from "@mui/material";
import api from "../services/api";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    level: "beginner",
    category: "programming",
    thumbnail: "",
    discount: "0",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/courses", formData);
      navigate(`/mentor/courses/${response.data.data._id}/modules`);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Course
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Price ($)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Discount (%)"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <MenuItem value="programming">Programming</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
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
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/mentor/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? "Creating..." : "Create Course"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateCourse;
