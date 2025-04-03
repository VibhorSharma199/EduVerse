import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert,
  CircularProgress,
} from "@mui/material";

const QuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      setQuiz(null);
      setCurrentQuestion(0);
      setSelectedAnswer("");
      setShowResult(false);
      setScore(0);

      // TODO: Implement Gemini API integration
      // For now, using mock data
      const mockQuiz = {
        questions: [
          {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: "Paris",
            explanation: "Paris is the capital city of France.",
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: "Mars",
            explanation:
              "Mars is called the Red Planet because of its reddish appearance.",
          },
        ],
      };

      setQuiz(mockQuiz);
      setSelectedAnswer("");
    } catch (error) {
      setError("Failed to generate quiz. Please try again.");
      console.error("Error generating quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === quiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowResult(false);
    setScore(0);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quiz Generator
        </Typography>

        {!quiz ? (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                fullWidth
                required
              />
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={level}
                  label="Difficulty Level"
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={generateQuiz}
                disabled={loading || !topic}
              >
                {loading ? <CircularProgress size={24} /> : "Generate Quiz"}
              </Button>
            </Box>
          </Paper>
        ) : showResult ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Quiz Results
            </Typography>
            <Typography variant="h6" gutterBottom>
              Your Score: {score} out of {quiz.questions.length}
            </Typography>
            <Button variant="contained" onClick={handleRestart} sx={{ mt: 2 }}>
              Take Another Quiz
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {quiz.questions[currentQuestion].question}
            </Typography>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select your answer:</FormLabel>
              <RadioGroup
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              >
                {quiz.questions[currentQuestion].options.map(
                  (option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  )
                )}
              </RadioGroup>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              sx={{ mt: 2 }}
            >
              {currentQuestion === quiz.questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default QuizGenerator;
