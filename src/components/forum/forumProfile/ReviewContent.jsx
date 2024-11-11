import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Rating,
} from "@mui/material";
import axios from "axios";

const ReviewContent = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/trips/${userId}/reviews`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [userId]);

  const handleViewProfile = (userId) => {
    navigate(`/forum-profile/${userId}`);
    window.location.reload();
  };

  return (
    <Box>
      {loading ? (
        <Typography variant="h6" color="textSecondary">
          Đang tải đánh giá...
        </Typography>
      ) : reviews.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Không có đánh giá nào.
        </Typography>
      ) : (
        reviews.map((review) => (
          <Card
            key={review._id}
            sx={{ mb: 2, boxShadow: "0 0 2px rgba(27, 39, 61, 0.25)" }}
          >
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      alt="User Avatar"
                      src={`http://localhost:8080${review.user.avatar}`}
                      sx={{
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        transition: "all linear 0.3s",
                        "&:hover": { opacity: 0.7 },
                      }}
                      onClick={() => handleViewProfile(review.user._id)}
                    />
                    <Box ml={1} mb={1}>
                      <Typography
                        variant="body1"
                        sx={{
                          "&:hover": {
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => handleViewProfile(review.user._id)}
                      >
                        {review.user.firstName} {review.user.lastName}
                      </Typography>
                      <Rating size="small" value={review.rating} readOnly />
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text-color" }}
                  >
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ReviewContent;
