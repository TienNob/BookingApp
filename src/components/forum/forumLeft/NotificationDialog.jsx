import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const NotificationDialog = ({ actorId, open, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Fetch notifications from API
  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get(`http://localhost:8080/api/notifications?actorId=${actorId}`)
        .then((response) => {
          setNotifications(response.data);
          console.log(response.data);
          setLoading(false);
          axios
            .patch(`http://localhost:8080/api/notifications/read`, {
              actorId,
            })
            .catch((error) => {
              console.error("Failed to update notifications as read", error);
            });
        })
        .catch((error) => {
          setError("Failed to load notifications");
          setLoading(false);
        });
    }
  }, [open, actorId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thông báo</DialogTitle>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", margin: "20px" }}
        >
          <CircularProgress />
        </div>
      ) : error ? (
        <div style={{ padding: "20px", color: "red" }}>{error}</div>
      ) : (
        <List sx={{ px: 1 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="Bạn không có thông báo nào!" />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <ListItem
                sx={{
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : "var(--bg-primary)",
                  borderRadius: "10px",
                  mb: 1,
                }}
                key={index}
              >
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.createdAt).toLocaleString()}
                />
              </ListItem>
            ))
          )}
        </List>
      )}
    </Dialog>
  );
};

export default NotificationDialog;
