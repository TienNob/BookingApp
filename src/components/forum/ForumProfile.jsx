import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Box,
  Avatar,
  Typography,
  Button,
  Card,
  CardContent,
  Input,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import coverImgDefault from "../../assets/coverIMG.png";

const ForumProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const userIdLocal = localStorage.getItem("userId");
  const [isFriend, setIsFriend] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // New state for avatar preview
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null); // New state for preview
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // Menu anchor state
  const [openAvatarPreviewDialog, setOpenAvatarPreviewDialog] = useState(false); // New state for avatar dialog
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );
        setUser(userResponse.data);

        const postsResponse = await axios.get(
          `http://localhost:8080/api/posts/actor/${userId}`
        );
        setPosts(postsResponse.data);

        const friendsResponse = await axios.get(
          `http://localhost:8080/api/users/${userId}/friends`
        );
        setFriends(friendsResponse.data.friends);
        const friendsUserResponse = await axios.get(
          `http://localhost:8080/api/users/${userIdLocal}/friends`
        );
        const isFriend = friendsUserResponse.data.friends.some(
          (friend) => friend._id === userId
        );
        setIsFriend(isFriend);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleAddOrRemoveFriend = async () => {
    try {
      if (isFriend) {
        await axios.delete(
          `http://localhost:8080/api/users/${userIdLocal}/friends/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFriend(false);
      } else {
        await axios.post(
          `http://localhost:8080/api/users/${userIdLocal}/friends`,
          {
            friendId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFriend(true);
      }
    } catch (error) {
      console.error("Error managing friend status:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverPhoto(file);
    setMenuAnchorEl(false);
    setCoverPhotoPreview(URL.createObjectURL(file)); // Create preview URL
  };

  const handleUploadCover = async () => {
    const formData = new FormData();
    formData.append("coverPhoto", coverPhoto);

    try {
      await axios.post(
        `http://localhost:8080/api/users/${userId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCoverPhotoPreview(null);
      const userResponse = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      setUser(userResponse.data);
    } catch (error) {
      console.error("Error uploading cover photo:", error);
    }
  };
  const handleDeleteCoverPhoto = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/users/${userId}/coverPhoto`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser((prevUser) => ({
        ...prevUser,
        coverPhoto: null,
      }));
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting cover photo:", error);
    }
  };

  const handleUploadAvatar = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      await axios.post(
        `http://localhost:8080/api/users/${userId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAvatarPreview(null);
      const userResponse = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      setUser(userResponse.data);
      setOpenAvatarPreviewDialog(false); // Close dialog after upload
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file)); // Create preview URL
    setOpenAvatarPreviewDialog(true); // Open dialog for preview
  };

  const handleCancelUpload = () => {
    setCoverPhoto(null);
    setCoverPhotoPreview(null);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  const handleViewProfile = (userId) => {
    navigate(`/forum-profile/${userId}`);
  };
  if (!user) return <p>Loading user data...</p>;

  return (
    <Container sx={{ pt: "100px" }}>
      <Card>
        <Box
          sx={{
            width: "100%",
            height: "300px",
            backgroundImage: `url(${
              coverPhotoPreview ||
              (user.coverPhoto
                ? `http://localhost:8080${user.coverPhoto}`
                : coverImgDefault)
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {userIdLocal === userId ? (
            <Button
              variant="contained"
              onClick={handleMenuOpen}
              sx={{
                position: "absolute",
                right: 16,
                bottom: 16,
                borderRadius: "8px",
                backgroundColor: "var(--grey)",
                "&:hover": { backgroundColor: "var(--subtext-color)" },
              }}
            >
              <PhotoCamera sx={{ mr: 1 }} /> Thay đổi ảnh bìa
            </Button>
          ) : (
            ""
          )}

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem>
              <label
                htmlFor="cover-photo-upload"
                style={{
                  width: "100%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FileUploadIcon sx={{ mr: 1 }} /> Tải ảnh lên
                <input
                  id="cover-photo-upload"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </label>
            </MenuItem>
            <MenuItem onClick={handleDeleteCoverPhoto}>
              <DeleteForeverIcon sx={{ mr: 1 }} />
              Xóa ảnh bìa
            </MenuItem>
          </Menu>
          {coverPhotoPreview && (
            <Box
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  borderRadius: "8px",

                  backgroundColor: "var(--primary-color)",
                  "&:hover": { backgroundColor: "var(--hover-color)" },
                }}
                onClick={handleUploadCover}
              >
                Xác nhận
              </Button>
              <Button
                variant="contain"
                sx={{
                  borderRadius: "8px",
                  color: "#fff",
                  backgroundColor: "var(--grey)",
                  "&:hover": {
                    backgroundColor: "var(--subtext-color)",
                  },
                }}
                onClick={handleCancelUpload}
              >
                Hủy
              </Button>
            </Box>
          )}
        </Box>
        <Box display="flex" alignItems="center" mt={-7} p={3}>
          <Box
            position="relative"
            onClick={
              userIdLocal === userId
                ? () => setOpenAvatarPreviewDialog(true)
                : null
            }
          >
            <Avatar
              src={`http://localhost:8080${user.avatar}` || ""}
              sx={{
                width: 150,
                height: 150,
                border: "5px solid white",
                transition: "all ease 0.3s",
                "&:hover": { filter: "brightness(95%)", cursor: "pointer" },
              }}
            />

            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 25,
                width: "35px",
                height: "35px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "var(--bg-primary)",
                borderRadius: "50%",
              }}
            >
              <PhotoCamera />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              width: "100%",
            }}
            ml={3}
          >
            <Box>
              <Typography variant="h4">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user.followers.length} Người theo dỗi
              </Typography>
            </Box>
            {userIdLocal !== userId ? (
              <Button
                variant="contained"
                onClick={handleAddOrRemoveFriend}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "var(--primary-color)",
                  "&:hover": { backgroundColor: "var(--hover-color)" },
                }}
              >
                {isFriend ? (
                  <>
                    <PersonRemoveOutlinedIcon sx={{ mr: 1 }} /> Hủy theo dõi
                  </>
                ) : (
                  <>
                    <PersonAddOutlinedIcon sx={{ mr: 1 }} /> Theo dõi
                  </>
                )}
              </Button>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Card>
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={4}>
          <Box mt={3}>
            <Typography variant="h6">Đang theo dỗi</Typography>
            <Grid container spacing={2} mt={1}>
              {friends.map((friend) => (
                <Grid item xs={4} md={3} lg={4} key={friend._id}>
                  <Card
                    onClick={() => {
                      handleViewProfile(friend._id);
                    }}
                  >
                    <CardActionArea>
                      <Avatar
                        sx={{ width: "100%", height: 140, borderRadius: 0 }}
                        alt={`${friend.firstName} ${friend.lastName}`}
                        src={
                          friend.avatar
                            ? `http://localhost:8080${friend.avatar}`
                            : undefined
                        }
                      />
                      <CardContent>
                        <Typography variant="p" component="div" align="center">
                          {friend.firstName} {friend.lastName}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box mt={3}>
            {posts.length === 0 ? (
              <Typography variant="h6" color="textSecondary">
                Không có bài viết
              </Typography>
            ) : (
              posts.map((post) => (
                <Card key={post._id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body1">{post.content}</Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={openAvatarPreviewDialog}
        onClose={() => setOpenAvatarPreviewDialog(false)}
      >
        <DialogContent>
          {avatarPreview && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                style={{
                  objectFit: "cover",
                  width: "400px",
                  height: "400px",
                  borderRadius: "50%",
                }}
              />
            </Box>
          )}
          <Button
            sx={{
              borderRadius: "8px",
              backgroundColor: "var(--primary-color)",
              "&:hover": {
                backgroundColor: "var(--hover-color)",
              },
            }}
            variant="contained"
            component="label"
          >
            <FileUploadIcon />
            Chọn hình ảnh từ file
            <input type="file" hidden onChange={handleAvatarFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAvatarPreviewDialog(false)}>Huỷ</Button>
          <Button
            onClick={handleUploadAvatar}
            color="primary"
            disabled={!avatar}
          >
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ForumProfile;
