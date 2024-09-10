import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import UserSearchDialog from "./UserSearchDialog"; // Import the new component
import io from "socket.io-client";

const socket = io("http://localhost:8080", {
  query: { token: localStorage.getItem("token") },
});

function ForumLeft() {
  const [open, setOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const [newMessages, setNewMessages] = useState(
    JSON.parse(localStorage.getItem("newMessageFlags")) || {}
  ); // Initialize from localStorage
  const navigate = useNavigate();

  // Xử lý mở modal và fetch dữ liệu người dùng
  const handleSearchClick = async () => {
    setOpen(true);
  };

  // Xử lý đóng modal
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      const updatedMessages = {
        ...newMessages,
        [msg.senderId]: true,
      };
      setNewMessages(updatedMessages);

      // Lưu vào localStorage
      localStorage.setItem("newMessageFlags", JSON.stringify(updatedMessages));
    });

    return () => {
      socket.off("newMessage");
    };
  }, [newMessages]);

  return (
    <List sx={{ backgroundColor: "#fff", borderRadius: "15px", px: 1 }}>
      <ListItem
        onClick={() => {
          navigate(`/forum-profile/${userId}`);
        }}
        button
        sx={{ borderRadius: "10px", mt: 1 }}
      >
        <ListItemIcon>
          <HomeIcon sx={{ color: "var(--primary-color)" }} />
        </ListItemIcon>
        <ListItemText primary="Trang cá nhân" />
      </ListItem>
      <ListItem
        button
        sx={{ borderRadius: "10px", mt: 1 }}
        onClick={handleSearchClick}
      >
        <ListItemIcon>
          <SearchIcon sx={{ color: "var(--primary-color)" }} />
        </ListItemIcon>
        <ListItemText primary="Tìm kiếm" />
      </ListItem>

      <ListItem
        onClick={() => {
          navigate("/chatbox");
        }}
        button
        sx={{ borderRadius: "10px", mt: 1 }}
      >
        <ListItemIcon>
          <Badge
            color="error"
            variant="dot"
            invisible={!Object.values(newMessages).some(Boolean)} // Show badge if there are any new messages
          >
            <MessageIcon sx={{ color: "var(--primary-color)" }} />
          </Badge>{" "}
        </ListItemIcon>
        <ListItemText primary="Tin nhắn" />
      </ListItem>

      <ListItem button sx={{ borderRadius: "10px", mt: 1 }}>
        <ListItemIcon>
          <NotificationsIcon sx={{ color: "var(--primary-color)" }} />
        </ListItemIcon>
        <ListItemText primary="Thông báo" />
      </ListItem>
      {/* Use the new UserSearchDialog component */}
      <UserSearchDialog open={open} onClose={handleClose} />
    </List>
  );
}

export default ForumLeft;
