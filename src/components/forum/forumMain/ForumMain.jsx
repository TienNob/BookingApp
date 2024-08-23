import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, InputBase, Avatar, IconButton } from "@mui/material";
import ForumPost from "./ForumPost";
import ForumContent from "./ForumContent";
function ForumMain() {
  const [openDialog, setOpenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleViewProfile = () => {
    navigate(`/forum-profile/${userId}`);
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton sx={{ p: 0, mr: 1 }}>
          <Avatar
            sx={{
              bgcolor: "var(--secondary-color)",
              cursor: "pointer",
              transition: "all linear 0.3s",
              "&:hover": { opacity: 0.7 },
            }}
            alt={user.firstName}
            src={`http://localhost:8080${user.avatar}` || ""}
            onClick={handleViewProfile}
          />
        </IconButton>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#fff",
            border: "1px solid var(--light-grey)",
            p: "8px 16px",
            borderRadius: "25px",
          }}
        >
          <InputBase
            fullWidth
            placeholder="Đăng bài thôi nào"
            readOnly
            onClick={handleOpenDialog}
          />
          <ForumPost open={openDialog} handleClose={handleCloseDialog} />
        </Box>
      </Box>
      <ForumContent />
    </Box>
  );
}

export default ForumMain;
