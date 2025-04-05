import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { EmojiEvents, Star, School, TrendingUp } from "@mui/icons-material";

const Profile = () => {
  const { user, loading, updateProfile, changePassword } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setSuccess("Password changed successfully!");
      setPasswordDialog(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to change password");
    }
  };

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  src={user?.profilePicture}
                  alt={user?.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h6">{user?.name}</Typography>
                <Typography color="textSecondary">{user?.email}</Typography>
                <Typography color="textSecondary" sx={{ mt: 1 }}>
                  {user?.role === "student" ? "Student" : "Mentor"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {editMode ? (
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        {/* Skills Section - Displaying Badges and Achievements */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Skills & Achievements
          </Typography>

          {/* Badges Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <EmojiEvents sx={{ mr: 1, color: "gold" }} />
              Badges
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {user?.badges?.length > 0 ? (
                user.badges.map((badge) => (
                  <Chip
                    key={badge._id}
                    icon={<EmojiEvents />}
                    label={badge.name}
                    color="primary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography color="textSecondary">
                  No badges earned yet
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Achievements Section */}
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Star sx={{ mr: 1, color: "orange" }} />
              Achievements
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {user?.achievements?.length > 0 ? (
                user.achievements.map((achievement) => (
                  <Chip
                    key={achievement._id}
                    icon={<Star />}
                    label={achievement.name}
                    color="secondary"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography color="textSecondary">
                  No achievements earned yet
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Password Change Dialog */}
        <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              onSubmit={handlePasswordSubmit}
              sx={{ pt: 2 }}
            >
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordSubmit} variant="contained">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="outlined"
          onClick={() => setPasswordDialog(true)}
          sx={{ mt: 2 }}
        >
          Change Password
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
