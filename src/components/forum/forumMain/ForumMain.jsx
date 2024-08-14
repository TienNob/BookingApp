import React, { useState } from "react";
import { Box, InputBase, Avatar, IconButton } from "@mui/material";
import ForumPost from "./ForumPost";
import ForumContent from "./ForumContent";
function ForumMain() {
  const [openDialog, setOpenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton sx={{ p: 0, mr: 1 }}>
          {user ? (
            <Avatar
              sx={{ bgcolor: "var(--secondary-color)" }}
              alt={user.firstName}
              src={"/static/images/avatar/2.jpg"}
            />
          ) : (
            <Avatar src={""} />
          )}
        </IconButton>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "var(--bg-primary)",
            p: "8px 16px",
            borderRadius: "25px",
          }}
        >
          <InputBase
            fullWidth
            placeholder="Đăng bài thôi nào"
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
