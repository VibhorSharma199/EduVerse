import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: "6rem",
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
          sx={{
            px: 4,
            py: 1.5,
          }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
