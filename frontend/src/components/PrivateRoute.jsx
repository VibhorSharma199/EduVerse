import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="100vh"
  >
    <CircularProgress size={40} />
    <Typography variant="body1" sx={{ mt: 2 }}>
      Loading...
    </Typography>
  </Box>
);

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Save the attempted URL for redirection after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn(
      `Access denied: User role '${user.role}' not in allowed roles:`,
      allowedRoles
    );
    return (
      <Navigate
        to="/"
        state={{ error: "You don't have permission to access this page" }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
