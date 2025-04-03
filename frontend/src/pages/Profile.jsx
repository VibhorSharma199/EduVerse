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
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import BadgesAndAchievements from "../components/BadgesAndAchievements";

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
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Please log in to view your profile
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                }}
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {user.role === "mentor" ? "Mentor" : "Student"}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setPasswordDialog(true)}
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </Grid>
            <Grid item xs={12} md={8}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
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
                      disabled={!editMode}
                      multiline
                      rows={4}
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

        <BadgesAndAchievements />
      </Box>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePasswordSubmit}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordSubmit} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
