import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItem,
  Avatar,
  Typography,
  Paper,
  TextField,
  Button,
  Badge,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8080", {
  query: { token: localStorage.getItem("token") },
});

// Khôi phục trạng thái tin nhắn mới từ localStorage
const getNewMessageFlags = () => {
  const flags = localStorage.getItem("newMessageFlags");
  return flags ? JSON.parse(flags) : {};
};
const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [newMessageFlags, setNewMessageFlags] = useState(getNewMessageFlags()); // Khôi phục trạng thái từ localStorage
  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);

  // Cập nhật trạng thái tin nhắn mới vào localStorage
  const updateNewMessageFlags = (flags) => {
    localStorage.setItem("newMessageFlags", JSON.stringify(flags));
  };

  const sortFriendsByLatestMessage = (friendsList) => {
    return friendsList.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp) : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp) : 0;
      return timeB - timeA; // Sort in descending order (most recent message first)
    });
  };

  // Fetch danh sách bạn bè
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${userId}/friends`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Fetch all messages for each friend and get the latest one
        const updatedFriends = await Promise.all(
          response.data.friends.map(async (friend) => {
            try {
              const messagesResponse = await axios.get(
                `http://localhost:8080/api/messages`,
                {
                  params: {
                    senderId: userId,
                    receiverId: friend._id,
                  },
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              // Sort the messages by timestamp and get the latest one
              const sortedMessages = messagesResponse.data.sort(
                (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
              );
              const lastMessage = sortedMessages[0] || null; // Get the latest message
              return {
                ...friend,
                lastMessage,
              };
            } catch (err) {
              console.error("Error fetching messages:", err);
              return {
                ...friend,
                lastMessage: null,
              };
            }
          })
        );
        const sortedFriends = updatedFriends.sort((a, b) => {
          const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp) : 0;
          const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp) : 0;
          return timeB - timeA; // Sort by descending order (most recent first)
        });

        setFriends(sortedFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [userId]);

  // Lắng nghe sự kiện tin nhắn mới
  useEffect(() => {
    if (selectedFriend) {
      socket.on("chatMessage", (msg) => {
        setChat((prevChat) => [...prevChat, msg]);
      });

      return () => {
        socket.off("chatMessage");
      };
    }
  }, [selectedFriend]);

  // Fetch tin nhắn của bạn bè khi chọn bạn
  useEffect(() => {
    if (selectedFriend) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/messages",
            {
              params: {
                senderId: userId,
                receiverId: selectedFriend._id,
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setChat(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedFriend, userId]);

  // Lắng nghe sự kiện tin nhắn mới từ server
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.senderId !== selectedFriend?._id) {
        setNewMessageFlags((prevFlags) => {
          const updatedFlags = {
            ...prevFlags,
            [msg.senderId]: true,
          };

          updateNewMessageFlags(updatedFlags); // Lưu vào localStorage
          return updatedFlags;
        });
        setFriends((prevFriends) => {
          const updatedFriends = prevFriends.map((friend) =>
            friend._id === msg.senderId
              ? { ...friend, lastMessage: msg }
              : friend
          );

          // Sort friends with the one who has the latest message on top
          return sortFriendsByLatestMessage(updatedFriends);
        });
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedFriend]);

  // Xử lý khi chọn bạn
  const handleFriendSelect = (friend) => {
    setSelectedFriend(friend);
    setChat([]); // Clear chat history for new friend
    setNewMessageFlags((prevFlags) => {
      const updatedFlags = {
        ...prevFlags,
        [friend._id]: false,
      };
      updateNewMessageFlags(updatedFlags); // Cập nhật localStorage
      return updatedFlags;
    });
  };

  // Tự động cuộn đến tin nhắn mới nhất
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  // Gửi tin nhắn
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && selectedFriend) {
      const newMessage = {
        text: message,
        receiverId: selectedFriend._id,
        senderId: userId,
        timestamp: new Date(),
      };
      setChat((prevChat) => [...prevChat, newMessage]);
      socket.emit("chatMessage", newMessage);
      setMessage("");
      setFriends((prevFriends) => {
        const updatedFriends = prevFriends.map((friend) =>
          friend._id === selectedFriend._id
            ? { ...friend, lastMessage: newMessage }
            : friend
        );

        // Sort friends with the one who has the latest message on top
        return sortFriendsByLatestMessage(updatedFriends);
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        pt: "70px",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      {/* Friends List */}
      <Box
        sx={{
          width: "250px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          backgroundColor: "#fff",
          px: 1,
        }}
      >
        <List>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <ListItem
                button
                sx={{ borderRadius: 3, mt: 1 }}
                key={friend._id}
                onClick={() => handleFriendSelect(friend)}
                selected={selectedFriend && selectedFriend._id === friend._id}
              >
                <Badge
                  sx={{
                    "& .MuiBadge-badge": {
                      right: 5,
                      top: 8,
                      border: `1px solid #fff`,
                      padding: "6px 6px",
                      borderRadius: "50%",
                    },
                  }}
                  color="error"
                  variant="dot"
                  invisible={!newMessageFlags[friend._id]} // Show the badge only if there are new messages
                >
                  <Avatar src={`http://localhost:8080${friend.avatar}`} />
                </Badge>
                <ListItemText
                  sx={{ ml: 2 }}
                  primary={`${friend.firstName} ${friend.lastName}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography sx={{ padding: "16px" }}>
              Theo dõi dể có thêm nhắn tin nào!!
            </Typography>
          )}
        </List>
      </Box>

      {/* Chat Area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          backgroundColor: "#fafafa",
        }}
      >
        {selectedFriend ? (
          <>
            {/* Chat Header */}
            <Box
              sx={{
                padding: "16px",
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ mr: 2 }}
                src={`http://localhost:8080${selectedFriend.avatar}`}
              />
              <Typography variant="h6">
                {selectedFriend.firstName} {selectedFriend.lastName}
              </Typography>
            </Box>

            {/* Chat Messages */}
            <Box
              sx={{
                flexGrow: 1,
                padding: "16px",
                overflowY: "auto",
              }}
            >
              {chat.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.senderId === userId ? "flex-end" : "flex-start", // Align right for sent messages
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        msg.senderId === userId ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      ref={index === chat.length - 1 ? messagesEndRef : null} // Scroll to the latest message
                      sx={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        backgroundColor:
                          msg.senderId === userId
                            ? "var(--primary-color)"
                            : "var(--light-grey)",
                        color: msg.senderId === userId ? "#fff" : "#000",
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Message Input Area */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                padding: "16px",
                borderTop: "1px solid #ddd",
                backgroundColor: "#fff",
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Soạn tin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                disabled={!selectedFriend}
                sx={{ mr: 2 }}
              />
              <Button
                sx={{
                  borderRadius: 3,
                  backgroundColor: "var(--primary-color)",
                  "&:hover": { backgroundColor: "var(--hover-color)" },
                }}
                variant="contained"
                color="primary"
                type="submit"
                disabled={!message.trim() || !selectedFriend}
              >
                <SendIcon />
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">Chọn bạn để trò chuyện</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatBox;
