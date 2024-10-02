import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, List, ListItem, Avatar, Button } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
// Get userId from local storage
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");
const ForumRight = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  // Function to get all users and exclude friends from the list
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/all");
      const users = response.data;
      // Exclude friends from the users list
      const nonFriendUsers = users.filter(
        (user) =>
          user._id !== userId &&
          user.role !== "admin" && // Exclude admin users
          !user.followers.some((follower) => follower === userId)
      );
      // Assuming you want to display 5 random users
      const randomUsers = nonFriendUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      setSuggestedUsers(randomUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to follow/unfollow a user
  const handleFollowToggle = async (user) => {
    try {
      if (user.followers.some((follower) => follower === userId)) {
        // Unfollow user
        await axios.delete(
          `http://localhost:8080/api/users/${userId}/friends/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        enqueueSnackbar(`Bạn đã huỷ theo dỗi ${user.lastName}`, {
          variant: "info",
        });
        // Update user's followers list by removing the current userId
        setSuggestedUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id
              ? {
                  ...u,
                  followers: u.followers.filter(
                    (follower) => follower !== userId
                  ),
                }
              : u
          )
        );
      } else {
        // Follow user
        await axios.post(
          `http://localhost:8080/api/users/${userId}/friends`,
          {
            friendId: user._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        enqueueSnackbar(`Bạn đã theo dỗi ${user.lastName}`, {
          variant: "success",
        });
        // Update user's followers list by adding the current userId
        setSuggestedUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id
              ? { ...u, followers: [...u.followers, userId] }
              : u
          )
        );
      }
    } catch (error) {
      enqueueSnackbar("lỗi theo dỗi/ huỷ theo dỗi", { variant: "error" });
      console.error("Error following/unfollowing user:", error);
    }
  };

  // Function to remove a suggested user
  const handleRemove = (id) => {
    setSuggestedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== id)
    );
  };
  const handleProfileClick = (userId) => {
    navigate(`/forum-profile/${userId}`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "15px",
      }}
    >
      <Typography sx={{ px: 2, pt: 2 }} variant="h6" gutterBottom>
        Có thể bạn biết
      </Typography>
      <List>
        {suggestedUsers.map((user) => (
          <ListItem
            key={user._id}
            sx={{ display: "flex", alignItems: "center", mb: "6px" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", mb: 1 }}>
                <Avatar
                  onClick={() => handleProfileClick(user._id)}
                  src={`http://localhost:8080${user.avatar}`}
                  sx={{
                    mr: 2,
                    width: "45px",
                    height: "45px",
                    cursor: "pointer",
                    transition: "all linear 0.3s",
                    "&:hover": { opacity: 0.7 },
                  }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    onClick={() => handleProfileClick(user._id)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {user.followers.length} người theo dõi
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    mb: 1,
                    borderRadius: 5,
                    fontSize: "12px",
                    backgroundColor: "var(--primary-color)",
                    "&:hover": {
                      backgroundColor: "var(--hover-color)",
                    },
                    px: 2,
                    py: 1,
                    mr: 1,
                  }}
                  onClick={() => handleFollowToggle(user)}
                >
                  {user.followers.some((follower) => follower === userId)
                    ? "Huỷ theo dõi"
                    : "Theo dõi"}
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    mb: 1,

                    backgroundColor: "var(--light-grey)",
                    "&:hover": {
                      backgroundColor: "var(--bg-color)",
                    },
                    color: "var(--subtext-color)",
                    borderRadius: 5,
                    fontSize: "12px",
                    px: 2,
                    py: 1,
                  }}
                  onClick={() => handleRemove(user._id)}
                >
                  Xoá
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ForumRight;
