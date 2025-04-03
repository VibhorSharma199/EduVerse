import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { EmojiEvents, Star, School, TrendingUp } from "@mui/icons-material";
import gamificationService from "../services/gamificationService";

const BadgesAndAchievements = () => {
  const [badges, setBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [badgesResponse, achievementsResponse] = await Promise.all([
        gamificationService.getBadges(),
        gamificationService.getAchievements(),
      ]);
      setBadges(badgesResponse.data);
      setAchievements(achievementsResponse.data);
    } catch (err) {
      console.error("Error fetching badges and achievements:", err);
      setError(
        err.response?.data?.message || "Failed to load badges and achievements"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
        <Typography
          color="primary"
          variant="body2"
          sx={{ cursor: "pointer", mt: 1 }}
          onClick={fetchData}
        >
          Try again
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Badges & Achievements
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Badges
            </Typography>
            <Grid container spacing={2}>
              {badges.map((badge) => (
                <Grid item xs={4} key={badge.id}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <img
                      src={badge.icon}
                      alt={badge.name}
                      style={{ width: 64, height: 64 }}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      {badge.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Achievements
            </Typography>
            <Grid container spacing={2}>
              {achievements.map((achievement) => (
                <Grid item xs={4} key={achievement.id}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <img
                      src={achievement.icon}
                      alt={achievement.name}
                      style={{ width: 64, height: 64 }}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      {achievement.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BadgesAndAchievements;
