import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  alpha,
} from "@mui/material";
import {
  School,
  TrendingUp,
  EmojiEvents,
  Star,
  PlayCircle,
  CheckCircle,
  Timeline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import dashboardService from "../services/dashboardService";

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha(color, 0.1),
              color: color,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const progress = (course.progress || 0) * 100;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={
          course.thumbnail ||
          "https://source.unsplash.com/random/400x200?education"
        }
        alt={course.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {course.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, textAlign: "right" }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          <Chip
            size="small"
            icon={<School />}
            label={course.category}
            variant="outlined"
          />
          <Chip
            size="small"
            icon={<PlayCircle />}
            label={`${course.totalModules} modules`}
            variant="outlined"
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate(`/courses/${course._id}`)}
        >
          Continue Learning
        </Button>
      </Box>
    </Card>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your learning progress and discover new courses
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Enrolled Courses"
            value={dashboardData?.enrolledCourses?.length || 0}
            icon={<School sx={{ fontSize: 32 }} />}
            color={theme.palette.primary.main}
            subtitle="Active courses"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Courses"
            value={dashboardData?.completedCourses?.length || 0}
            icon={<CheckCircle sx={{ fontSize: 32 }} />}
            color={theme.palette.success.main}
            subtitle="Courses finished"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Badges Earned"
            value={user?.badges?.length || 0}
            icon={<EmojiEvents sx={{ fontSize: 32 }} />}
            color={theme.palette.warning.main}
            subtitle="Achievements unlocked"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Learning Streak"
            value={`${dashboardData?.learningStreak || 0} days`}
            icon={<Timeline sx={{ fontSize: 32 }} />}
            color={theme.palette.info.main}
            subtitle="Keep it up!"
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Continue Learning
        </Typography>
        <Grid container spacing={3}>
          {dashboardData?.enrolledCourses?.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Recommended Courses
        </Typography>
        <Grid container spacing={3}>
          {dashboardData?.recommendedCourses?.map((course) => (
            <Grid item key={course._id} xs={12} sm={6} md={4}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
