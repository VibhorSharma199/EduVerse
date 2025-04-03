import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    handleClose();
  };

  if (loading) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Learn-F
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user ? (
            <>
              <IconButton
                onClick={handleMenu}
                color="inherit"
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar>{user.name?.[0] || "U"}</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleClose}
                >
                  Profile
                </MenuItem>
                {user.role === "mentor" && (
                  <MenuItem
                    component={RouterLink}
                    to="/mentor/dashboard"
                    onClick={handleClose}
                  >
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
