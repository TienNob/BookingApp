import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import NotificationDialog from "./NotificationDialog";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import UserSearchDialog from "./UserSearchDialog"; // Import the new component
import io from "socket.io-client";

const socket = io("http://localhost:8080", {
  query: { token: localStorage.getItem("token") },
});

function ForumLeft() {
  const [open, setOpen] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications
  const userId = localStorage.getItem("userId");
  const [newMessages, setNewMessages] = useState(
    JSON.parse(localStorage.getItem("newMessageFlags")) || {}
  ); // Initialize from localStorage
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Xử lý mở modal và fetch dữ liệu người dùng
  const handleSearchClick = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setOpen(true);
  };

  // Xử lý đóng modal
  const handleClose = () => {
    setOpen(false);
  };

  const handleNotiClick = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setOpenNoti(true);
  };

  // Xử lý đóng modal
  const handleCloseNoti = () => {
    setOpenNoti(false);
  };
  useEffect(() => {
    if (userId) {
      axios
        .get(
          `http://localhost:8080/api/notifications/unread-count?actorId=${userId}`
        )
        .then((response) => {
          setUnreadCount(response.data.count);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch unread count", error);
        });
    }
  }, [userId, openNoti]);

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
          if (!token) {
            navigate("/login");
            return;
          }
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
          if (!token) {
            navigate("/login");
            return;
          }
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

      <ListItem
        onClick={handleNotiClick}
        button
        sx={{ borderRadius: "10px", mt: 1 }}
      >
        <ListItemIcon>
          <Badge
            sx={{
              "& .MuiBadge-badge": {
                minWidth: 16,
                height: 16,
                fontSize: "0.75rem",
                padding: "0 4px",
              },
            }}
            color="error"
            badgeContent={unreadCount}
            invisible={unreadCount === 0} // Hide badge if no unread notifications
          >
            <NotificationsIcon sx={{ color: "var(--primary-color)" }} />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Thông báo" />
      </ListItem>
      <ListItem
        onClick={() => {
          if (!token) {
            navigate("/login");
            return;
          }
          navigate(`/my-trips`);
        }}
        button
        sx={{ borderRadius: "10px", mt: 1 }}
      >
        <ListItemIcon>
          <MarkunreadMailboxIcon sx={{ color: "var(--primary-color)" }} />
        </ListItemIcon>
        <ListItemText primary="Chuyến đi đã tạo" />
      </ListItem>
      <ListItem
        onClick={() => {
          if (!token) {
            navigate("/login");
            return;
          }
          navigate(`/my-tickets`);
        }}
        button
        sx={{ borderRadius: "10px", mt: 1 }}
      >
        <ListItemIcon>
          <ConfirmationNumberIcon sx={{ color: "var(--primary-color)" }} />
        </ListItemIcon>
        <ListItemText primary="Vé đã mua" />
      </ListItem>
      {/* Use the new UserSearchDialog component */}
      <UserSearchDialog open={open} onClose={handleClose} />
      <NotificationDialog
        actorId={userId}
        open={openNoti}
        onClose={handleCloseNoti}
      />
    </List>
  );
}

export default ForumLeft;
