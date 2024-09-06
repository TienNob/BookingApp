import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, Avatar, Button } from "@mui/material";
import axios from "axios";

// Get userId from local storage
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token"); // Assuming token is stored in local storage

const ForumRight = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  // Function to get all users and exclude friends from the list
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/all");
      const users = response.data;
      console.log(users);
      // Exclude friends from the users list
      const nonFriendUsers = users.filter(
        (user) =>
          user._id !== userId &&
          !user.followers.some((follower) => follower === userId)
      );
      // Assuming you want to display 3 random users
      const randomUsers = nonFriendUsers
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      setSuggestedUsers(randomUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to follow a user
  const handleFollow = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/${userId}/friends`,
        {
          friendId: id, // Pass the user ID to follow
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Followed user successfully:", response.data);
      fetchUsers();
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(); // Then fetch users and exclude friends
    };

    fetchData();
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
                  src={`http://localhost:8080${user.avatar}`}
                  sx={{ mr: 2 }}
                />
                <Box>
                  <Typography variant="body1">
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {user.followers.length} người theo dỗi
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  sx={{
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
                  onClick={() => handleFollow(user._id)}
                >
                  Theo dỗi
                </Button>
                <Button
                  variant="contained"
                  sx={{
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
                  onClick={() => handleFollow(user._id)}
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
