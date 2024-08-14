import React, { useEffect, useState, useCallback } from "react";
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
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import notIMG from "../../../assets/cannotImg.jpg";

const formatDistanceToNowInVietnamese = (date) => {
  return formatDistanceToNow(date, { locale: vi, addSuffix: true });
};
const ForumContent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [heartedPosts, setHeartedPosts] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3); // Number of posts to show initially
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for more posts
  const [hasMorePosts, setHasMorePosts] = useState(true); // Flag to check if more posts are available
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts");
        const postsData = response.data;

        const updatedHeartedPosts = new Set(
          postsData
            .filter((post) => post.hearts.includes(userId))
            .map((post) => post._id)
        );

        setHeartedPosts(updatedHeartedPosts);
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleHeart = async (postId) => {
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
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={"/static/images/avatar/2.jpg"}
                      alt={post.actor?.firstName}
                      sx={{ width: 45, height: 45 }}
                    />
                    <Box>
                      <Typography variant="h6" component="span">
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
                      image={post.image || notIMG}
                      alt="Post image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = notIMG;
                      }}
                    />
                  )}
                  {post.trip && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Available Seats: {post.trip.seatsAvailable}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Locations: {post.trip.locations.join(" - ")}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Prices:{" "}
                        {post.trip.prices
                          .map((price) => `${price} VND`)
                          .join(", ")}
                      </Typography>
                    </Box>
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
                                sx={{ mr: 2, width: "35px", height: "35px" }}
                                alt={
                                  comment.user._id === userId
                                    ? "Bạn"
                                    : comment.user.firstName
                                }
                                src={"/static/images/avatar/2.jpg"}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
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
    </Grid>
  );
};

export default ForumContent;
