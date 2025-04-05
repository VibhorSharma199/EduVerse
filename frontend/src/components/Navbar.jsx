import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Chat as ChatIcon,
  School as SchoolIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const Navbar = ({ onChatClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const handleChatClick = () => {
    handleClose();
    onChatClick();
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <SchoolIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Learn-F
        </Typography>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleChatClick}
              title="Chat with AI Assistant"
            >
              <ChatIcon />
            </IconButton>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/dashboard");
                }}
              >
                Dashboard
              </MenuItem>
              {user.role === "mentor" && (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/mentor-dashboard");
                  }}
                >
                  Mentor Dashboard
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Box>
        )}

        {/* Mobile menu */}
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            <MenuItem
              onClick={() => {
                handleCloseNavMenu();
                navigate("/courses");
              }}
            >
              <Typography textAlign="center">Courses</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseNavMenu();
                navigate("/dashboard");
              }}
            >
              <Typography textAlign="center">Dashboard</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseNavMenu();
                navigate("/leaderboard");
              }}
            >
              <Typography textAlign="center">Leaderboard</Typography>
            </MenuItem>
            {user && user.role === "mentor" && (
              <MenuItem
                onClick={() => {
                  handleCloseNavMenu();
                  navigate("/mentor-dashboard");
                }}
              >
                <Typography textAlign="center">Mentor Dashboard</Typography>
              </MenuItem>
            )}
          </Menu>
        </Box>

        {/* Desktop menu */}
        {!isMobile && (
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              onClick={() => navigate("/courses")}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Courses
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate("/leaderboard")}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Leaderboard
            </Button>
            {user && user.role === "mentor" && (
              <Button
                onClick={() => navigate("/mentor-dashboard")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Mentor Dashboard
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
