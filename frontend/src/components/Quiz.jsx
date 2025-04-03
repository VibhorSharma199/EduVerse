import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/api/quizzes/${id}`);
        setQuiz(response.data.data);
        setTimeLeft(response.data.data.timeLimit * 60);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quiz");
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, showResults]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const timeTaken = quiz.timeLimit * 60 - timeLeft;
      const response = await axios.post(`/api/quizzes/${id}/submit`, {
        answers: Object.entries(answers).map(
          ([questionId, selectedAnswer]) => ({
            questionId,
            selectedAnswer,
          })
        ),
        timeTaken,
      });

      setResults(response.data.data);
      setShowResults(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
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

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" component="h1">
              {quiz.title}
            </Typography>
            <Typography
              variant="h5"
              color={timeLeft < 60 ? "error" : "primary"}
            >
              Time Left: {formatTime(timeLeft)}
            </Typography>
          </Box>

          {!showResults ? (
            <>
              <Typography variant="body1" paragraph>
                {quiz.description}
              </Typography>

              {quiz.questions.map((question, index) => (
                <Box key={question._id} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Question {index + 1}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {question.question}
                  </Typography>
                  <RadioGroup
                    value={answers[question._id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question._id, e.target.value)
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={optionIndex}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    Object.keys(answers).length !== quiz.questions.length
                  }
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Submit Quiz"
                  )}
                </Button>
              </Box>
            </>
          ) : (
            <Box>
              <Typography variant="h5" gutterBottom>
                Quiz Results
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  color={results.passed ? "success.main" : "error.main"}
                >
                  {results.passed
                    ? "Congratulations! You passed!"
                    : "Sorry, you didn't pass."}
                </Typography>
                <Typography variant="body1">
                  Score: {results.score.toFixed(1)}%
                </Typography>
                <Typography variant="body1">
                  Points Earned: {results.earnedPoints} / {results.totalPoints}
                </Typography>
              </Box>

              {results.answers && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Question Review
                  </Typography>
                  {results.answers.map((answer, index) => (
                    <Box key={answer.questionId} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        Question {index + 1}
                      </Typography>
                      <Typography
                        color={answer.isCorrect ? "success.main" : "error.main"}
                        gutterBottom
                      >
                        {answer.isCorrect ? "Correct" : "Incorrect"}
                      </Typography>
                      {answer.explanation && (
                        <Typography variant="body2" color="text.secondary">
                          Explanation: {answer.explanation}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(-1)}
                >
                  Back to Module
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Quiz;
