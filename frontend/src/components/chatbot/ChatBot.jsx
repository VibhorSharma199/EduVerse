import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Send as SendIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../config";

const ChatBot = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: input,
          userId: user?._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
        suggestions: data.suggestions || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chatbot error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const getSuggestedPrompts = () => {
    return [
      {
        icon: <SchoolIcon />,
        text: "Explain a concept from my course",
        prompt: "Can you explain the concept of...",
      },
      {
        icon: <CodeIcon />,
        text: "Help with coding",
        prompt: "I need help with this code...",
      },
      {
        icon: <PsychologyIcon />,
        text: "Learning strategies",
        prompt: "What are effective strategies for...",
      },
      {
        icon: <LightbulbIcon />,
        text: "Study tips",
        prompt: "Give me tips for studying...",
      },
    ];
  };

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          height: isMobile ? "calc(100vh - 120px)" : "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                bgcolor: "secondary.main",
                mr: 1,
              }}
            >
              <PsychologyIcon />
            </Avatar>
            <Typography variant="h6">Learn-F Assistant</Typography>
          </Box>
          <Tooltip title="Clear chat">
            <IconButton color="inherit" onClick={handleClearChat} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
            bgcolor: "background.default",
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "text.secondary",
              }}
            >
              <Typography variant="h6" gutterBottom>
                How can I help you today?
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 3 }}>
                Ask me anything about your courses, coding, or learning
                strategies
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                {getSuggestedPrompts().map((item, index) => (
                  <Chip
                    key={index}
                    icon={item.icon}
                    label={item.text}
                    onClick={() => handleSuggestionClick(item.prompt)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      flexDirection:
                        message.sender === "user" ? "row-reverse" : "row",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          message.sender === "user"
                            ? "primary.main"
                            : "secondary.main",
                        width: 32,
                        height: 32,
                        ml: message.sender === "user" ? 1 : 0,
                        mr: message.sender === "user" ? 0 : 1,
                      }}
                    >
                      {message.sender === "user" ? user?.name?.[0] || "U" : "A"}
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor:
                          message.sender === "user"
                            ? "primary.main"
                            : "background.paper",
                        color:
                          message.sender === "user" ? "white" : "text.primary",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {message.text}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                        <Tooltip title="Copy message">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyMessage(message.text)}
                            sx={{ ml: 1 }}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </Box>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <Box
                      sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      {message.suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          size="small"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Divider />
        <Box sx={{ p: 2, bgcolor: "background.paper" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              variant="outlined"
              size="small"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              sx={{
                borderRadius: 2,
                minWidth: 100,
              }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
          {error && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatBot;
