import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import moduleService from "../services/moduleService";
import geminiService from "../services/geminiService";

const QuizPage = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [module, setModule] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchModuleData();
  }, [courseId, moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const moduleData = await moduleService.getModule(courseId, moduleId);
      setModule(moduleData);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load quiz data");
      setLoading(false);
    }
  };

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const currentQuestion = module.quiz.questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

      if (isCorrect) {
        setScore(score + 1);
      }

      // Get AI explanation
      const aiExplanation = await geminiService.generateQuizExplanation(
        currentQuestion.question,
        currentQuestion.correctAnswer
      );
      setExplanation(aiExplanation);
      setShowExplanation(true);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to process answer");
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < module.quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
      setExplanation("");
    } else {
      // Quiz completed
      navigate(`/courses/${courseId}/modules/${moduleId}`);
    }
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
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}`)}
            startIcon={<ArrowBackIcon />}
          >
            Back to Module
          </Button>
        </Box>
      </Container>
    );
  }

  if (!module || !module.quiz) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 2 }}>
          No quiz available for this module
        </Alert>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/courses/${courseId}/modules/${moduleId}`)}
            startIcon={<ArrowBackIcon />}
          >
            Back to Module
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = module.quiz.questions[currentQuestionIndex];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() =>
                navigate(`/courses/${courseId}/modules/${moduleId}`)
              }
            >
              Back to Module
            </Button>
            <Typography variant="h6">
              Question {currentQuestionIndex + 1} of{" "}
              {module.quiz.questions.length}
            </Typography>
          </Box>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {currentQuestion.question}
              </Typography>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={handleAnswerSelect}
                >
                  {currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                      disabled={showExplanation}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {showExplanation ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Explanation
              </Typography>
              <Paper sx={{ p: 3, bgcolor: "background.default" }}>
                <Typography>{explanation}</Typography>
              </Paper>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowBackIcon />}
                >
                  {currentQuestionIndex < module.quiz.questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
              >
                Submit Answer
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default QuizPage;
