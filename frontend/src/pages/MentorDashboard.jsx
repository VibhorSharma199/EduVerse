import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import courseService from "../services/courseService";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const response = await courseService.getMentorCourses();
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching mentor data:", err);
        setError("Failed to load mentor data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreateCourse = () => {
    navigate("/create-course");
  };

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/mentor/courses/${courseId}/edit`);
  };

  const handleManageModules = (courseId) => {
    navigate(`/mentor/courses/${courseId}/modules`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mentor Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SchoolIcon />}
          onClick={handleCreateCourse}
        >
          Create New Course
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="My Courses" />
          <Tab label="Students" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <SchoolIcon
                    sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                  />
                  <Typography variant="h5">Courses</Typography>
                </Box>
                <Typography variant="h3">{courses.length}</Typography>
                <Typography color="text.secondary">Active Courses</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PeopleIcon
                    sx={{ fontSize: 40, color: "secondary.main", mr: 2 }}
                  />
                  <Typography variant="h5">Students</Typography>
                </Box>
                <Typography variant="h3">
                  {courses.reduce(
                    (total, course) =>
                      total + (course.enrolledStudents?.length || 0),
                    0
                  )}
                </Typography>
                <Typography color="text.secondary">
                  Total Enrolled Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AssignmentIcon
                    sx={{ fontSize: 40, color: "success.main", mr: 2 }}
                  />
                  <Typography variant="h5">Completion Rate</Typography>
                </Box>
                <Typography variant="h3">78%</Typography>
                <Typography color="text.secondary">
                  Average Course Completion
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {courses.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                  >
                    You haven't created any courses yet.
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SchoolIcon />}
                      onClick={handleCreateCourse}
                    >
                      Create Your First Course
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            courses.map((course) => (
              <Grid item xs={12} md={6} key={course._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {course.description.substring(0, 100)}
                      {course.description.length > 100 ? "..." : ""}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Chip
                        icon={<PeopleIcon />}
                        label={`${course.enrolledStudents?.length || 0} Students`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        icon={<AssignmentIcon />}
                        label={`${course.modules?.length || 0} Modules`}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleViewCourse(course._id)}
                    >
                      View Course
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleEditCourse(course._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleManageModules(course._id)}
                    >
                      Manage Modules
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Student Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {courses.length === 0 ? (
              <Typography color="text.secondary">
                No student activity to display. Create a course to start
                tracking student progress.
              </Typography>
            ) : (
              <List>
                {courses.flatMap((course) =>
                  (course.enrolledStudents || []).map((student) => (
                    <ListItem key={`${course._id}-${student._id}`}>
                      <ListItemAvatar>
                        <Avatar src={student.profilePicture}>
                          {student.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={student.name}
                        secondary={`Enrolled in ${course.title}`}
                      />
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Completed Module 3"
                        color="success"
                        size="small"
                      />
                    </ListItem>
                  ))
                )}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default MentorDashboard;
