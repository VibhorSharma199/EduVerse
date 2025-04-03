import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import mentorService from "../services/mentorService";

const ModuleManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modules, setModules] = useState([]);
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [openLectureDialog, setOpenLectureDialog] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    order: 0,
  });
  const [lectureForm, setLectureForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    order: 0,
  });

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await mentorService.getCourseById(courseId);
      if (response.status === "success") {
        setModules(response.data.modules || []);
      }
    } catch (error) {
      setError("Failed to load modules");
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModuleDialog = (module = null) => {
    if (module) {
      setModuleForm({
        title: module.title,
        description: module.description,
        order: module.order,
      });
      setSelectedModule(module);
    } else {
      setModuleForm({
        title: "",
        description: "",
        order: modules.length,
      });
      setSelectedModule(null);
    }
    setOpenModuleDialog(true);
  };

  const handleOpenLectureDialog = (module) => {
    setSelectedModule(module);
    setLectureForm({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      order: module.lectures.length,
    });
    setOpenLectureDialog(true);
  };

  const handleCloseModuleDialog = () => {
    setOpenModuleDialog(false);
    setSelectedModule(null);
    setModuleForm({
      title: "",
      description: "",
      order: 0,
    });
  };

  const handleCloseLectureDialog = () => {
    setOpenLectureDialog(false);
    setSelectedModule(null);
    setLectureForm({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      order: 0,
    });
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedModule) {
        await mentorService.updateModule(selectedModule._id, moduleForm);
      } else {
        await mentorService.createModule({
          ...moduleForm,
          courseId,
        });
      }
      await fetchModules();
      handleCloseModuleDialog();
    } catch (error) {
      setError("Failed to save module");
      console.error("Error saving module:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await mentorService.addLecture(selectedModule._id, lectureForm);
      await fetchModules();
      handleCloseLectureDialog();
    } catch (error) {
      setError("Failed to save lecture");
      console.error("Error saving lecture:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        setLoading(true);
        await mentorService.deleteModule(moduleId);
        await fetchModules();
      } catch (error) {
        setError("Failed to delete module");
        console.error("Error deleting module:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteLecture = async (moduleId, lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        setLoading(true);
        await mentorService.deleteLecture(moduleId, lectureId);
        await fetchModules();
      } catch (error) {
        setError("Failed to delete lecture");
        console.error("Error deleting lecture:", error);
      } finally {
        setLoading(false);
      }
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
            Course Modules
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModuleDialog()}
          >
            Add Module
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {modules.map((module) => (
            <Grid item xs={12} key={module._id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography variant="h6">{module.title}</Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {module.description}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => handleOpenModuleDialog(module)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteModule(module._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1">Lectures</Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenLectureDialog(module)}
                      >
                        Add Lecture
                      </Button>
                    </Box>

                    <List>
                      {module.lectures.map((lecture) => (
                        <ListItem key={lecture._id}>
                          <ListItemText
                            primary={lecture.title}
                            secondary={`Duration: ${lecture.duration} minutes`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() =>
                                handleDeleteLecture(module._id, lecture._id)
                              }
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => {
                                // Handle lecture preview
                                window.open(lecture.videoUrl, "_blank");
                              }}
                              color="primary"
                            >
                              <PlayArrowIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Module Dialog */}
        <Dialog open={openModuleDialog} onClose={handleCloseModuleDialog}>
          <DialogTitle>
            {selectedModule ? "Edit Module" : "Add New Module"}
          </DialogTitle>
          <form onSubmit={handleModuleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                required
                value={moduleForm.title}
                onChange={(e) =>
                  setModuleForm({ ...moduleForm, title: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={moduleForm.description}
                onChange={(e) =>
                  setModuleForm({ ...moduleForm, description: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Order"
                type="number"
                fullWidth
                value={moduleForm.order}
                onChange={(e) =>
                  setModuleForm({
                    ...moduleForm,
                    order: parseInt(e.target.value),
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModuleDialog}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Lecture Dialog */}
        <Dialog open={openLectureDialog} onClose={handleCloseLectureDialog}>
          <DialogTitle>Add New Lecture</DialogTitle>
          <form onSubmit={handleLectureSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Title"
                fullWidth
                required
                value={lectureForm.title}
                onChange={(e) =>
                  setLectureForm({ ...lectureForm, title: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={lectureForm.description}
                onChange={(e) =>
                  setLectureForm({
                    ...lectureForm,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Video URL"
                fullWidth
                required
                value={lectureForm.videoUrl}
                onChange={(e) =>
                  setLectureForm({ ...lectureForm, videoUrl: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Duration (minutes)"
                type="number"
                fullWidth
                required
                value={lectureForm.duration}
                onChange={(e) =>
                  setLectureForm({
                    ...lectureForm,
                    duration: parseInt(e.target.value),
                  })
                }
              />
              <TextField
                margin="dense"
                label="Order"
                type="number"
                fullWidth
                value={lectureForm.order}
                onChange={(e) =>
                  setLectureForm({
                    ...lectureForm,
                    order: parseInt(e.target.value),
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLectureDialog}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ModuleManagement;
