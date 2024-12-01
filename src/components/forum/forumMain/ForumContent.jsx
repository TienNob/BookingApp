import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  Avatar,
  Stack,
  IconButton,
  Collapse,
  Divider,
  InputBase,
  Skeleton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import SendIcon from "@mui/icons-material/Send";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import notIMG from "../../../assets/cannotImg.jpg";
import ImagePreview from "../../ImagePreview";

const formatDistanceToNowInVietnamese = (date) => {
  return formatDistanceToNow(date, { locale: vi, addSuffix: true });
};
const ForumContent = ({ postsData, userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [heartedPosts, setHeartedPosts] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Number of posts to show initially
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for more posts
  const [hasMorePosts, setHasMorePosts] = useState(true); // Flag to check if more posts are available
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  useEffect(() => {
    if (postsData) {
      const updatedHeartedPosts = new Set(
        postsData
          .filter((post) => post.hearts.includes(userId))
          .map((post) => post._id)
      );

      setHeartedPosts(updatedHeartedPosts);
      setPosts(postsData);
      setLoading(false);
    }
  }, [postsData, userId]);

  const handleHeart = async (postId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts/${postId}/hearts`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { hearted } = response.data;

      setHeartedPosts((prev) => {
        const updated = new Set(prev);
        if (hearted) {
          updated.add(postId);
        } else {
          updated.delete(postId);
        }
        return updated;
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                hearts: hearted
                  ? [...post.hearts, userId]
                  : post.hearts.filter((id) => id !== userId),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error hearting post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/posts/${postId}/comments`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedPosts = posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  user: { _id: userId },
                  text: newComment,
                  createdAt: new Date(),
                },
              ],
            }
          : post
      );
      setPosts(updatedPosts);
      setNewComment("");
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const handleExpandClick = (postId) => {
    setExpandedPostId((prevId) => (prevId === postId ? null : postId));
  };
  const loadMorePosts = useCallback(() => {
    if (loadingMore || !hasMorePosts) return;

    setLoadingMore(true);
    setTimeout(() => {
      setPosts((prevPosts) => {
        const newVisibleCount = visibleCount + 3;

        if (newVisibleCount >= prevPosts.length) {
          setHasMorePosts(false);
        }
        setVisibleCount(newVisibleCount);
        return prevPosts;
      });
      setLoadingMore(false);
    }, 500);
  }, [loadingMore, hasMorePosts, visibleCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, hasMorePosts]);

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const handleViewDetails = (tripId) => {
    navigate(`/ticket-detail/${tripId}`);
  };
  const handleViewProfile = (userId) => {
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/forum-profile/${userId}`);
  };
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };
  const handleCloseModalImage = () => {
    setOpenModal(false);
    setSelectedImage("");
  };
  return (
    <Grid container spacing={2}>
      {loading
        ? Array.from(new Array(3)).map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="circular" width={45} height={45} />
                    <Box>
                      <Skeleton width={100} height={20} />
                      <Skeleton width={140} height={15} />
                    </Box>
                  </Stack>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <Box mt={2} display="flex">
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="circular" width={24} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        : sortedPosts.slice(0, visibleCount).map((post) => (
            <Grid item xs={12} key={post._id}>
              <Card
                sx={{
                  boxShadow: "0 0 2px rgba(27, 39, 61, 0.25)",
                  mb: 1,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={`http://localhost:8080${post.actor.avatar}` || ""}
                      alt={post.actor?.firstName}
                      onClick={() => handleViewProfile(post.actor._id)}
                      sx={{
                        width: 40,
                        height: 40,
                        cursor: "pointer",
                        transition: "all linear 0.3s",
                        "&:hover": { opacity: 0.7 },
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        component="span"
                        onClick={() => handleViewProfile(post.actor._id)}
                        sx={{
                          cursor: "pointer",

                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {post.actor.firstName} {post.actor.lastName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {formatDistanceToNowInVietnamese(
                          new Date(post.createdAt)
                        )}{" "}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body1" component="p" mt={2} mb={2}>
                    {post.postContent}
                  </Typography>
                  {post.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      sx={{ objectFit: "contain" }}
                      onClick={() =>
                        handleImageClick(`http://localhost:8080${post.image}`)
                      }
                      image={`http://localhost:8080${post.image}` || notIMG}
                      alt="Post image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = notIMG;
                      }}
                    />
                  )}
                  {post.trip && (
                    <Card
                      onClick={() => handleViewDetails(post.trip._id)}
                      sx={{
                        p: 2,
                        mt: 2,
                        boxShadow: "0 0 5px rgba(27, 39, 61, 0.25)",
                        transition: "all linear 0.2s",
                        "&:hover": {
                          cursor: "pointer",
                          boxShadow: "0 0 5px  rgba(81, 192, 113, 0.25)",
                          color: "var(--primary-color)",
                        },
                      }}
                    >
                      <Typography variant="h6" mb={1} gutterBottom>
                        Thông tin chuyến đi
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        mb={1}
                        sx={{ color: "var(--subtext-color)" }}
                      >
                        - Tuyến đường:{" "}
                        {post.trip.locations.map((location, index) => (
                          <React.Fragment key={index}>
                            {location}
                            {index < post.trip.locations.length - 1 && (
                              <EastOutlinedIcon
                                sx={{
                                  fontSize: "14px",
                                  mx: 1,
                                  color: "var(--primary-color)",
                                }}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        mb={1}
                        color="text.secondary"
                      >
                        - Giờ khởi hành:{" "}
                        {new Date(post.trip.departureTime).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        mb={1}
                        color="text.secondary"
                      >
                        - Loại xe: {post.trip.totalSeats} chỗ
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        mb={1}
                        color="text.secondary"
                      >
                        - Số ghế trống: {post.trip.seatsAvailable}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        mb={1}
                        color="text.secondary"
                      >
                        - Giá trên 1km: {post.trip.costPerKm} VND
                      </Typography>
                    </Card>
                  )}
                  <Box mt={2} display="flex">
                    <Box>
                      <IconButton
                        onClick={() => handleHeart(post._id)}
                        color={heartedPosts.has(post._id) ? "error" : "default"}
                      >
                        {heartedPosts.has(post._id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <Typography
                        variant="caption"
                        fontSize="14px"
                        color="text.secondary"
                      >
                        {post.hearts.length}
                      </Typography>
                    </Box>
                    <Box ml={1}>
                      <IconButton onClick={() => handleExpandClick(post._id)}>
                        <ModeCommentOutlinedIcon />
                      </IconButton>

                      <Typography
                        variant="caption"
                        fontSize="14px"
                        color="text.secondary"
                      >
                        {post.comments.length}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Comments Section */}
                  <Collapse
                    in={expandedPostId === post._id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "var(--bg-primary)",
                        p: "4px 16px",
                        borderRadius: "10px",
                      }}
                    >
                      <InputBase
                        fullWidth
                        placeholder="Bình luận bài viết"
                        value={newComment}
                        onKeyUp={(e) => {
                          if (e.key === "Enter" && newComment) {
                            handleComment(post._id);
                          }
                        }}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                      <IconButton
                        sx={{ color: "var(--primary-color)" }}
                        disabled={!newComment.trim()}
                        onClick={() => handleComment(post._id)}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>

                    <Box mt={2} sx={{ maxHeight: 200, overflowY: "auto" }}>
                      {post.comments
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((comment) => (
                          <Box
                            key={comment.createdAt}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Avatar
                                sx={{
                                  mr: 2,
                                  width: "35px",
                                  height: "35px",
                                  cursor: "pointer",
                                  transition: "all linear 0.3s",
                                  "&:hover": { opacity: 0.7 },
                                }}
                                onClick={() =>
                                  handleViewProfile(comment.user._id)
                                }
                                src={
                                  comment.user._id === userId
                                    ? `http://localhost:8080${user.avatar}`
                                    : `http://localhost:8080${comment.user.avatar}`
                                }
                              />
                              <Box>
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  sx={{
                                    cursor: "pointer",

                                    "&:hover": { textDecoration: "underline" },
                                  }}
                                  onClick={() =>
                                    handleViewProfile(comment.user._id)
                                  }
                                >
                                  {comment.user._id === userId
                                    ? "Bạn"
                                    : `${comment.user.firstName} ${comment.user.lastName}`}
                                </Typography>
                                <Typography variant="body2">
                                  {comment.text}
                                </Typography>
                              </Box>
                            </Stack>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {formatDistanceToNowInVietnamese(
                                new Date(comment.createdAt)
                              )}
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
      {loadingMore && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Skeleton variant="rectangular" width="100%" height={200} />
              <Skeleton variant="text" width="100%" height={20} />
              <Box mt={2} display="flex">
                <Skeleton variant="circular" width={45} height={45} />
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="circular" width={24} height={24} />
              </Box>
            </CardContent>
          </Card>{" "}
        </Grid>
      )}
      <ImagePreview
        open={openModal}
        imageUrl={selectedImage}
        onClose={handleCloseModalImage}
      />
    </Grid>
  );
};

export default ForumContent;
