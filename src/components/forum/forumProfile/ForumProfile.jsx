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
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  CardActionArea,
  CardMedia,
  Tabs,
  Tab,
  AvatarGroup,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useSnackbar } from "notistack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import CarRentalOutlinedIcon from "@mui/icons-material/CarRentalOutlined";
import Tooltip from "@mui/material/Tooltip";
import coverImgDefault from "../../../assets/coverIMG.png";
import ForumContent from "../forumMain/ForumContent";
import FormEditProfile from "./FormEditProfile";
import ImagePreview from "../../ImagePreview";
import ProfileImage from "./ProfileImage";
import ReviewsContent from "./ReviewContent";
import ProfileFriend from "./ProfileFriend";
import ProfileFollower from "./ProfileFollower";
const ForumProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const userIdLocal = localStorage.getItem("userId");
  const [isFriend, setIsFriend] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null); // New state for avatar preview
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null); // New state for preview
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // Menu anchor state
  const [activeMenu, setActiveMenu] = useState(null);
  const [openAvatarPreviewDialog, setOpenAvatarPreviewDialog] = useState(false); // New state for avatar dialog
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar(); // Initialize snackbar
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8080/api/users/${userId}`
        );
        setUser(userResponse.data);

        try {
          const postsResponse = await axios.get(
            `http://localhost:8080/api/posts/actor/${userId}`
          );
          setPosts(postsResponse.data); // Gán dữ liệu nếu có bài viết
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("No posts found for this user.");
            setPosts([]);
          } else {
            throw error;
          }
        }

        const imagesResponse = await axios.get(
          `http://localhost:8080/api/posts/images/${userId}`
        );
        setImages(imagesResponse.data);

        const friendsResponse = await axios.get(
          `http://localhost:8080/api/users/${userId}/friends`
        );
        setFriends(friendsResponse.data.friends);

        const followerResponse = await axios.get(
          `http://localhost:8080/api/users/${userId}/followers`
        );
        setFollowers(followerResponse.data.followers);

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
        enqueueSnackbar(`Bạn đã huỷ theo dỗi ${user.lastName}`, {
          variant: "info",
        });
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
        enqueueSnackbar(`Theo dỗi thành công  ${user.lastName}`, {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error managing friend status:", error);
      enqueueSnackbar("Gặp lỗi khi xử lý", { variant: "error" });
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
      enqueueSnackbar(`Thay đổi ảnh bìa thành công!`, { variant: "success" });
      const userResponse = await axios.get(
        `http://localhost:8080/api/users/${userId}`
      );
      setUser(userResponse.data);
    } catch (error) {
      enqueueSnackbar(`Thay đổi ảnh bìa thất bại!`, { variant: "error" });
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
      enqueueSnackbar(`Xoá ảnh bìa thành công!`, { variant: "success" });
      handleMenuClose();
    } catch (error) {
      enqueueSnackbar(`Xoá ảnh bìa thất bại!`, { variant: "error" });
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
      const updatedUser = userResponse.data;
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        storedUser.avatar = updatedUser.avatar;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }

      setOpenAvatarPreviewDialog(false); // Close dialog after upload
      enqueueSnackbar(`Thay đổi ảnh đại diện thành công!`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(`Thay đổi ảnh đại diện thất bại!`, { variant: "error" });
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

  const handleMenuOpen = (event, menuId) => {
    setMenuAnchorEl(event.currentTarget);
    setActiveMenu(menuId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveMenu(null);
  };
  const handleViewProfile = (userId) => {
    navigate(`/forum-profile/${userId}`);
    window.location.reload();
  };
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };
  const handleCloseModalImage = () => {
    setOpenModal(false);
    setSelectedImage("");
  };
  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  if (!user) return <p>Loading user data...</p>;

  return (
    <Box sx={{ backgroundColor: "var(--bg-primary)" }}>
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
                onClick={(event) => handleMenuOpen(event, "coverPhotoMenu")}
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
              open={Boolean(menuAnchorEl && activeMenu === "coverPhotoMenu")}
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
          <Box
            display="flex"
            alignItems="center"
            sx={{ flexDirection: { xs: "column", md: "row" } }}
            mt={-7}
            p={3}
          >
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

              {userIdLocal === userId ? (
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
              ) : (
                ""
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "end" },
                ml: { xs: 0, md: 3 },
                pt: 2,
                width: "100%",
              }}
            >
              <Box>
                <Typography variant="h4">
                  {user.firstName} {user.lastName}{" "}
                  <Tooltip title="Tài khoản tài xế">
                    <CarRentalOutlinedIcon
                      sx={{ color: "var(--secondary-color)" }}
                    />
                  </Tooltip>
                </Typography>

                <Typography variant="body2" color="textSecondary">
                  {user.followers.length} Người theo dỗi
                </Typography>
                <AvatarGroup
                  onClick={() => {
                    setSelectedTab(4);
                  }}
                  sx={{ justifyContent: "flex-end" }}
                  max={4}
                >
                  {followers.map((follower) => (
                    <Avatar
                      sx={{
                        cursor: "pointer",
                        width: "24px",
                        height: "24px",
                      }}
                      key={follower._id}
                      alt={`${follower.firstName} ${follower.lastName}`}
                      src={
                        follower.avatar
                          ? `http://localhost:8080${follower.avatar}`
                          : undefined
                      }
                    ></Avatar>
                  ))}
                </AvatarGroup>
              </Box>
              <Box>
                {userIdLocal !== userId ? (
                  <Button
                    variant="contained"
                    onClick={handleAddOrRemoveFriend}
                    sx={{
                      borderRadius: "8px",
                      mt: 1,
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
                {userIdLocal === userId ? (
                  <IconButton
                    aria-label="more"
                    aria-controls="user-actions-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuOpen(event, "menuMore")}
                    sx={{ ml: 1, mt: 1 }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                ) : (
                  ""
                )}
                <Menu
                  id="user-actions-menu"
                  anchorEl={menuAnchorEl}
                  keepMounted
                  open={Boolean(menuAnchorEl && activeMenu === "menuMore")}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => setOpenAvatarPreviewDialog(true)}>
                    Thay đổi ảnh đại diện
                  </MenuItem>
                  <MenuItem onClick={handleOpenEdit}>
                    Chỉnh sửa thông tin
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        </Card>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedTab(2);
                  }}
                  mb={2}
                  variant="h6"
                >
                  Hình ảnh
                </Typography>
                <Grid container spacing={1}>
                  {images.length > 0 ? (
                    images.slice(0, 3).map((image, index) => (
                      <Grid item xs={4} sm={3} md={4} key={index}>
                        <Card
                          sx={{
                            position: "relative",
                            height: 0,
                            paddingTop: "100%",
                          }}
                        >
                          <CardMedia
                            onClick={() =>
                              handleImageClick(`http://localhost:8080${image}`)
                            }
                            component="img"
                            image={`http://localhost:8080${image}`}
                            alt={"Hình ảnh bị lỗi"}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {index === 2 && images.length > 3 && (
                            <Box
                              onClick={() => {
                                setSelectedTab(2);
                              }}
                              sx={{
                                position: "absolute",
                                cursor: "pointer",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                bgcolor: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "1.5rem",
                              }}
                            >
                              +{images.length - 3}
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography
                      sx={{ textAlign: "center", width: "100%" }}
                      variant="h6"
                      color="textSecondary"
                    >
                      Không có hình ảnh
                    </Typography>
                  )}
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography
                  onClick={() => {
                    setSelectedTab(3);
                  }}
                  variant="h6"
                  sx={{ cursor: "pointer" }}
                >
                  Đang theo dỗi
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedTab(3);
                  }}
                >
                  {friends.length} người bạn đang theo dỗi
                </Typography>
                <Grid container spacing={2} mt={1}>
                  {friends.slice(0, 6).map((friend) => (
                    <Grid item xs={4} md={4} lg={4} key={friend._id}>
                      <Card
                        sx={{ height: "100%" }}
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
                            <Typography
                              variant="p"
                              component="div"
                              align="center"
                            >
                              {friend.firstName} {friend.lastName}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box>
              <Card
                sx={{
                  mb: 2,
                  pb: 0,
                  boxShadow: "0 0 2px rgba(27, 39, 61, 0.25)",
                }}
              >
                <CardContent>
                  <Tabs
                    variant="scrollable"
                    scrollButtons={false}
                    sx={{ color: "var(--primary-color) !important" }}
                    value={selectedTab}
                    onChange={handleTabChange}
                  >
                    <Tab label="Bài viết" />
                    <Tab label="Đánh giá" />
                    <Tab label="Hình ảnh" />
                    <Tab label="Đang theo dỗi" />
                    <Tab label="Được theo dỗi" />
                  </Tabs>{" "}
                </CardContent>
              </Card>
              {selectedTab === 0 ? (
                posts.length === 0 ? (
                  <Typography variant="h6" color="textSecondary">
                    Không có bài viết
                  </Typography>
                ) : (
                  <ForumContent postsData={posts} userId={userIdLocal} />
                )
              ) : selectedTab === 1 ? (
                <ReviewsContent userId={userIdLocal} />
              ) : selectedTab === 2 ? (
                <ProfileImage userId={userIdLocal} images={images} />
              ) : selectedTab === 3 ? (
                <ProfileFriend
                  friends={friends}
                  onViewProfile={handleViewProfile}
                />
              ) : (
                <ProfileFollower
                  followers={followers}
                  handleViewProfile={handleViewProfile}
                />
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
            <Button onClick={() => setOpenAvatarPreviewDialog(false)}>
              Huỷ
            </Button>
            <Button
              onClick={handleUploadAvatar}
              color="primary"
              disabled={!avatar}
            >
              Xác Nhận
            </Button>
          </DialogActions>
        </Dialog>
        <ImagePreview
          open={openModal}
          imageUrl={selectedImage}
          onClose={handleCloseModalImage}
        />
        <FormEditProfile
          open={openEdit}
          handleClose={handleCloseEdit}
          userId={userIdLocal}
        />
      </Container>
    </Box>
  );
};

export default ForumProfile;
