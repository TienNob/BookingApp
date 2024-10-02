import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import WebIcon from "@mui/icons-material/Web";

function AdminNav({ handleDrawerToggle }) {
  // State to handle menu open/close
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.lastName);

  // Functions to open and close the menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAnchorEl(null);
    navigate("/login");
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: "calc(100% - 250px)" },
        ml: { md: "250px" },
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "none",
        backdropFilter: "blur(10px)",
        color: "var(--text-color)",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }} // Hide on md and up
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} /> {/* Pushes icons to the right */}
        <IconButton color="inherit" sx={{ mr: 2 }}>
          <SearchIcon />
        </IconButton>
        <IconButton color="inherit" sx={{ mr: 2 }}>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={handleMenuClick}>
          <Avatar
            sx={{ backgroundColor: "var(--primary-color)" }}
            alt={user.lastName}
            src={user.avatar || ""}
          >
            {user.lastName[0]}
          </Avatar>
        </IconButton>
        {/* Menu component */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              navigate(`/`);
            }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                padding: "4px 14px 4px 4px",
              }}
            >
              <WebIcon sx={{ mr: 1 }} /> Trang người dùng
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                padding: "4px 14px 4px 4px",
                color: "var(--red)",
              }}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              Đăng xuất
            </Typography>
          </MenuItem>{" "}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNav;
