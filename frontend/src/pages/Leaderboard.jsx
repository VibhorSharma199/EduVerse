import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import gamificationService from "../services/gamificationService";
import { useAuth } from "../contexts/AuthContext";

const Leaderboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("all");
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [period]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gamificationService.getLeaderboard(period);

      // Ensure data is an array
      const leaderboardArray = Array.isArray(data)
        ? data
        : data.leaderboard || data.data || [];

      setLeaderboardData(leaderboardArray);

      // Find user's rank
      if (user && leaderboardArray.length > 0) {
        const userIndex = leaderboardArray.findIndex(
          (item) => item.userId === user._id || item._id === user._id
        );
        if (userIndex !== -1) {
          setUserRank({
            rank: userIndex + 1,
            ...leaderboardArray[userIndex],
          });
        }
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (event, newValue) => {
    setPeriod(newValue);
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "#FFD700"; // Gold
    if (rank === 2) return "#C0C0C0"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return "inherit";
  };

  const formatPoints = (points) => {
    return points.toLocaleString();
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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Leaderboard
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        See how you rank against other learners
      </Typography>

      {/* User's rank card */}
      {userRank && (
        <Card
          sx={{
            mb: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Typography variant="h2" component="div">
                  #{userRank.rank}
                </Typography>
                <Typography variant="subtitle1">Your Rank</Typography>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Typography variant="h4" component="div">
                  {formatPoints(userRank.points || userRank.score || 0)}
                </Typography>
                <Typography variant="subtitle1">Your Points</Typography>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Typography variant="h4" component="div">
                  {userRank.badges?.length || 0}
                </Typography>
                <Typography variant="subtitle1">Badges Earned</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Period selector */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={period}
          onChange={handlePeriodChange}
          aria-label="leaderboard period tabs"
          centered
        >
          <Tab label="All Time" value="all" />
          <Tab label="This Month" value="month" />
          <Tab label="This Week" value="week" />
        </Tabs>
      </Box>

      {/* Leaderboard table */}
      {leaderboardData.length > 0 ? (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Points</TableCell>
                <TableCell align="right">Badges</TableCell>
                <TableCell align="right">Courses Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((item, index) => (
                <TableRow
                  key={item._id || item.userId || index}
                  sx={{
                    backgroundColor:
                      user &&
                      (item.userId === user._id || item._id === user._id)
                        ? "rgba(25, 118, 210, 0.08)"
                        : "inherit",
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: getRankColor(index + 1),
                      }}
                    >
                      {index < 3 ? (
                        <TrophyIcon sx={{ mr: 1 }} />
                      ) : (
                        <Typography variant="body1">#{index + 1}</Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={item.avatar || item.profilePicture}
                        alt={item.name || "User"}
                        sx={{ mr: 2 }}
                      >
                        {(item.name || "U")[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {item.name || "Anonymous User"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.role || "Student"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold">
                      {formatPoints(item.points || item.score || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.badges?.length || 0}
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.completedCourses?.length || 0}
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No leaderboard data available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later to see the rankings
          </Typography>
        </Paper>
      )}

      {/* Stats cards */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Leaderboard Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <TimelineIcon
                    sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="h4" component="div">
                    {leaderboardData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Participants
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <PersonIcon
                    sx={{ fontSize: 40, color: "secondary.main", mb: 1 }}
                  />
                  <Typography variant="h4" component="div">
                    {leaderboardData.length > 0
                      ? formatPoints(
                          leaderboardData.reduce(
                            (sum, item) =>
                              sum + (item.points || item.score || 0),
                            0
                          ) / leaderboardData.length
                        )
                      : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Points
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <TrophyIcon
                    sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
                  />
                  <Typography variant="h4" component="div">
                    {leaderboardData.length > 0
                      ? formatPoints(
                          leaderboardData[0].points ||
                            leaderboardData[0].score ||
                            0
                        )
                      : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Highest Score
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Leaderboard;
