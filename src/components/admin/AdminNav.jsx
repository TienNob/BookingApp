import React, { useState, useEffect } from "react";
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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import WebIcon from "@mui/icons-material/Web";

function AdminNav({ handleDrawerToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] =
    useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications count
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("userId");
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationMenuAnchorEl);

  // Fetch notifications and unread count
  useEffect(() => {
    fetch(`http://localhost:8080/api/notifications?actorId=${userId}`)
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error("Error fetching notifications:", error));

    fetchUnreadCount();
  }, []);

  // Fetch unread count
  const fetchUnreadCount = () => {
    fetch(
      `http://localhost:8080/api/notifications/unread-count?actorId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => setUnreadCount(data.count))
      .catch((error) => console.error("Error fetching unread count:", error));
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClick = (event) => {
    setNotificationMenuAnchorEl(event.currentTarget);

    // Mark notifications as read
    fetch("http://localhost:8080/api/notifications/read", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ actorId: userId }),
    })
      .then(() => {
        setUnreadCount(0); // Reset unread count to 0 after marking as read
      })
      .catch((error) => console.error("Error updating notifications:", error));
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchorEl(null);
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
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" onClick={handleNotificationMenuClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={notificationMenuAnchorEl}
          open={notificationsOpen}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
        >
          <List sx={{ height: "500px", overflowY: "scroll" }}>
            {notifications.length ? (
              notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  sx={{
                    mx: 1,
                    px: 2,
                    my: 1,
                    borderRadius: 3,
                    maxWidth: "500px",

                    backgroundColor: notification.isRead
                      ? "#f5f5f5"
                      : "var(--bg-primary)", // Set a different color for unread notifications
                  }}
                >
                  <ListItemText primary={notification.message} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No new notifications" />
              </ListItem>
            )}
          </List>
        </Menu>
        <IconButton color="inherit" onClick={handleMenuClick}>
          <Avatar
            sx={{ backgroundColor: "var(--primary-color)" }}
            alt={user.lastName}
            src={user.avatar || ""}
          >
            {user.lastName[0]}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
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
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNav;
