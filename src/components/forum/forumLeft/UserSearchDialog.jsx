// UserSearchDialog.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function UserSearchDialog({ open, onClose, users, loading, error }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredUsers([]); // Không hiển thị kết quả nếu không có từ khóa tìm kiếm
    } else {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(query) ||
          user.phone.includes(query)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/forum-profile/${userId}`);
    onClose(); // Close the modal after navigating
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
        <SearchIcon sx={{ color: "var(--primary-color)", mr: 1 }} />
        Tìm kiếm người dùng
      </DialogTitle>
      <DialogContent sx={{ pt: "8px !important" }}>
        <TextField
          fullWidth
          focused
          variant="outlined"
          label="Nhập tên hoặc số điện thoại"
          value={searchQuery}
          onChange={handleSearch}
          disabled={loading || error}
        />
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : error ? (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <List>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItemButton
                  sx={{ borderRadius: 4 }}
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        user.avatar
                          ? `http://localhost:8080${user.avatar}`
                          : undefined
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.firstName}  ${user.lastName}`}
                    secondary={`${user.followers.length} Đang theo dỗi`}
                  />
                </ListItemButton>
              ))
            ) : searchQuery && filteredUsers.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center">
                Không tìm thấy người dùng nào.
              </Typography>
            ) : null}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserSearchDialog;
