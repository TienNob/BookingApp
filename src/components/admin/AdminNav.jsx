import React from "react";
import { AppBar, Toolbar, IconButton, Box, Badge, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

function AdminNav({ handleDrawerToggle }) {
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
        <IconButton color="inherit">
          <Avatar alt="User Avatar" src="/path-to-your-avatar.jpg" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNav;
