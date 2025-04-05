import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";
import geminiService from "../services/geminiService";

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI learning assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await geminiService.chatWithAI(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 350,
        height: 500,
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">AI Learning Assistant</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <Paper
              sx={{
                p: 2,
                bgcolor: message.role === "user" ? "primary.main" : "grey.100",
                color: message.role === "user" ? "white" : "text.primary",
              }}
            >
              <Typography>{message.content}</Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress size={20} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatBot;
