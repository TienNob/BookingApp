import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  IconButton,
  Popover,
  TextField,
  Button,
  InputAdornment,
  Grid,
  Breadcrumbs,
  Avatar,
  CardMedia,
  Link,
  Rating,
} from "@mui/material";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import axios from "axios";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import ImagePreview from "../ImagePreview";
import { useSnackbar } from "notistack";

const TicketDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [images, setImages] = useState([]);
  const [trip, setTrip] = useState(null);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [seatCount, setSeatCount] = useState("");
  const [seatOrder, setSeatOrder] = useState("");
  const [error, setError] = useState("");
  const [activeButtonId, setActiveButtonId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [initPrice, setInitPrice] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [showIncompleteTripMessage, setShowIncompleteTripMessage] =
    useState(false);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const totalAmount = Math.round(
    (initPrice[activeButtonId] * seatOrder) / 1000
  );
  const formattedAmount = formatNumber(totalAmount);

  const { enqueueSnackbar } = useSnackbar(); // Initialize snackbar
  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3); // Load 3 more reviews each time
  };
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/trips/${id}`
        );
        setTrip(response.data);
        setReviews(response.data.reviews);
        setInitPrice(response.data.prices);
        setUser(response.data.user);
        const imagesResponse = await axios.get(
          `http://localhost:8080/api/posts/images/${response.data.user._id}`
        );
        setImages(imagesResponse.data);
      } catch (error) {
        console.error("Error fetching trip detail:", error);
      }
    };
    fetchTripDetail();
  }, [id]);
  console.log(trip);

  const handleSeatCountChange = (event) => {
    const value = parseInt(event.target.value);
    if (selectedRoute) {
      const availableSeats = trip.seatsAvailable;

      if (isNaN(value) || value <= 0) {
        setError("Số ghế phải lớn hơn 0.");
      } else if (value > availableSeats) {
        setError(`Số ghế không được vượt quá ${availableSeats} ghế trống.`);
      } else {
        setError("");
      }

      setSeatCount(value);
    }
  };
  const handlePayment = async () => {
    const amount =
      Math.round((initPrice[activeButtonId] * seatOrder) / 1000) * 1000;
    console.log(amount);
    const description = `Thanh toán cho ${user.firstName} ${user.lastName}`;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/payment",
        {
          amount: amount,
          description: description,
          tripId: id,
          location: `${selectedRoute.startLocation} - ${selectedRoute.endLocation}`,
          userId: userId,
          actorId: user._id,
          seatsPurchased: seatOrder,
          departureTime: trip.departureTime,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { return_code, return_message, sub_return_message, order_url } =
        response.data;
      console.log(return_code);
      if (return_code === 1) {
        enqueueSnackbar("Đang chuyển đến trang thanh toán!", {
          variant: "success",
        });

        // Điều hướng tới orderUrl sau khi thanh toán thành công
        if (order_url) {
          window.location.href = order_url;
        } else {
          enqueueSnackbar("Không tìm thấy URL đặt hàng", { variant: "error" });
        }
      } else {
        // Hiển thị thông báo lỗi với chi tiết từ API
        enqueueSnackbar(
          `Thanh toán thất bại: ${return_message} (${sub_return_message})`,
          { variant: "error" }
        );
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      enqueueSnackbar("Thanh toán thất bại", { variant: "error" });
    }
  };

  const handleIconClick = (event, index, route) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoute(route);
    setActiveButtonId(index);
    setSeatCount("");
    setError("");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddSeat = () => {
    if (seatCount && !error) {
      setSeatOrder(seatCount);
      handleClose();
    }
  };
  const handleViewProfile = (userId) => {
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

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    const eligibleCustomer = trip.tickets.some(
      (ticket) => ticket.customerId === userId
    );
    setIsEligibleToReview(eligibleCustomer);
    if (trip.state !== 7 || !eligibleCustomer) {
      setShowIncompleteTripMessage(true);
      console.log(1);
    } else {
      setShowIncompleteTripMessage(false);
      console.log(2);
    }
  };
  const handleReviewChange = (event) => {
    setReview(event.target.value);
    const eligibleCustomer = trip.tickets.some(
      (ticket) => ticket.customerId === userId
    );
    setIsEligibleToReview(eligibleCustomer && trip.state === 7);
    if (trip.state !== 7 || !eligibleCustomer) {
      setShowIncompleteTripMessage(true);
    } else {
      setShowIncompleteTripMessage(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/trips/${id}/reviews`,
        {
          rating: rating,
          comment: review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newReview = {
        ...response.data.review,
        user: {
          _id: userId,
          avatar: userLocal.avatar,
          firstName: userLocal.firstName,
          lastName: userLocal.lastName,
        },
        createdAt: new Date(),
      };
      // Update the reviews state with the new review
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
      // Handle error (e.g., show an error message)
    }
  };
  console.log(reviews[0]);

  const handleFollowToggle = async (user) => {
    const isFollowing = user.followers.some((follower) => follower === userId);

    try {
      if (isFollowing) {
        // Unfollow the user
        await axios.delete(
          `http://localhost:8080/api/users/${userId}/friends/${user._id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser((prevUser) => ({
          ...prevUser,
          followers: prevUser.followers.filter(
            (follower) => follower !== userId
          ),
        }));
        enqueueSnackbar("Huỷ theo dõi thành công!", { variant: "success" });
      } else {
        // Follow the user
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
        setUser((prevUser) => ({
          ...prevUser,
          followers: [...prevUser.followers, userId],
        }));
        enqueueSnackbar("Theo dõi thành công!", { variant: "success" });
      }
    } catch (error) {
      console.error("Error managing follow status:", error);
      enqueueSnackbar("Gặp lỗi khi xử lý", { variant: "error" });
    }
  };
  function formatNumber(number) {
    return number.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu phân cách mỗi 3 đơn vị
  }

  const open = Boolean(anchorEl);
  const idPopover = open ? "simple-popover" : undefined;

  if (!trip) return <Typography variant="h6">Loading...</Typography>;

  const locations = trip.locations;
  const prices =
    trip.prices.map((price) =>
      (Math.round(price / 1000) * 1000)
        .toLocaleString("en-US")
        .replace(/,/g, ".")
    ) || [];
  const colors = [
    "#c19af0",
    "#cc7da8",
    "#e3d845",
    "#b2edb3",
    "#5ccdd4",
    "#c0897f",
    "#c0897f",
  ];
  let colorIndexRoute = 0;
  let colorIndexTicket = 0;
  let priceIndex = 0;
  let routeIndex = 0; // Initialize the route index
  return (
    <Container sx={{ mt: "100px", mb: 3 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          sx={{ display: "flex", alignItems: "center" }}
          underline="hover"
          color="inherit"
          component={RouterLink}
          to="/tickets"
        >
          <ConfirmationNumberOutlinedIcon sx={{ mr: 0.5 }} fontSize="inherit" />{" "}
          Danh sách vé
        </Link>
        <Typography color="text.primary">Chi tiết vé</Typography>
      </Breadcrumbs>
      <Card
        sx={{
          mt: 2,
          overflowX: "auto",
          maxWidth: "100%",
        }}
      >
        <CardContent>
          <Box
            mt={3}
            sx={{
              whiteSpace: "nowrap", // Ngăn các điểm xuống hàng
              overflowX: "auto",
            }}
            position="relative"
          >
            {locations.map((startLocation, startIndex) => (
              <Box key={startIndex} mb={5}>
                {/* Hiển thị các điểm */}
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    position: "relative",
                    pl: 50,
                    zIndex: 1,
                    mb: 10,
                  }}
                >
                  <Box />
                  <PlaceOutlinedIcon sx={{ color: "var(--secondary-color)" }} />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {startLocation}
                  </Typography>
                </Box>

                {locations
                  .slice(startIndex + 1)
                  .map((endLocation, endIndex) => {
                    const actualEndIndex = startIndex + endIndex + 1;
                    const gap = actualEndIndex - startIndex;
                    const color = colors[colorIndexRoute++ % colors.length]; // Chọn màu sắc tiếp theo
                    const currentPrice = prices[priceIndex++];

                    return (
                      <Box
                        key={actualEndIndex}
                        sx={{
                          position: "absolute",
                          left:
                            gap > 2
                              ? `${400 / gap / 2 + actualEndIndex}px` // Thêm bù vào vị trí 'left'
                              : gap === 2
                              ? `${400 / 1.7 + actualEndIndex * -10}px` // Điều kiện cho gap = 2
                              : `${400 / gap + actualEndIndex * -10}px`,
                          top: `${startIndex * 100 + 17}px`, // Điều chỉnh vị trí top của dây nối
                          height: `${gap * 100}px`, // Điều chỉnh chiều cao của dây nối tùy thuộc vào khoảng cách giữa các điểm
                          width: 2,
                          bgcolor: color, // Màu sắc của dây nối
                          zIndex: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          align="center"
                          sx={{
                            position: "absolute",
                            whiteSpace: "wrap",
                            top: `${(gap / 2) * 70 - 10}px`,
                            right: 10,
                            color: color, // Màu sắc của giá tiền
                          }}
                        >
                          {currentPrice} VND
                        </Typography>
                      </Box>
                    );
                  })}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box p={3} display="flex" flexDirection="column">
              <Typography variant="h5" mb={3} gutterBottom>
                Thông tin người đăng
              </Typography>
              {user && (
                <>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      onClick={() => {
                        handleViewProfile(user._id);
                      }}
                      src={
                        user.avatar
                          ? `http://localhost:8080${user.avatar}`
                          : undefined
                      }
                      sx={{ mr: 2, cursor: "pointer" }}
                    />
                    <Box sx={{ mr: "auto" }}>
                      <Typography
                        sx={{
                          cursor: "pointer",
                          "&:hover": { opacity: 0.7 },
                        }}
                        onClick={() => {
                          handleViewProfile(user._id);
                        }}
                        variant="h6"
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.followers.length} đang theo dỗi
                      </Typography>
                    </Box>
                    {user._id !== userId ? (
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: 2,
                          fontSize: "12px",
                          backgroundColor: "var(--primary-color)",
                          "&:hover": {
                            backgroundColor: "var(--hover-color)",
                          },
                        }}
                        onClick={() => handleFollowToggle(user)}
                      >
                        {user.followers.some(
                          (follower) => follower === userId
                        ) ? (
                          <>
                            <PersonRemoveOutlinedIcon sx={{ mr: 1 }} /> Huỷ theo
                            dõi
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

                  <Typography variant="body1" color="textSecondary">
                    Số điện thoại: {user.phone}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1} sx={{ p: 2 }}>
              {images.slice(0, 3).map((image, index) => (
                <Grid item xs={4} sm={4} md={4} key={index}>
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
                        sx={{
                          position: "absolute",
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
              ))}
              {images.length === 0 && (
                <Typography
                  sx={{ textAlign: "center", width: "100%" }}
                  variant="h6"
                  color="textSecondary"
                >
                  Không có hình ảnh
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", p: 3 }}>
            <Typography variant="h5" mb={3} gutterBottom>
              Chọn vé theo tuyến đường
            </Typography>

            {locations.map((startLocation, startIndex) =>
              locations.slice(startIndex + 1).map((endLocation, endIndex) => {
                const color = colors[colorIndexTicket++ % colors.length];
                const currentRouteIndex = routeIndex++;
                return (
                  <IconButton
                    key={`${startIndex}-${endIndex}`}
                    sx={{
                      bgcolor: `${color} !important`,
                      color: "#fff",
                      transition: "all ease 0.1s",
                      border:
                        activeButtonId === currentRouteIndex
                          ? "1px solid var(--red)"
                          : "",
                      m: 1,
                      "&:hover": {
                        border: "1px solid var(--red)",
                      },
                    }}
                    onClick={(event) =>
                      handleIconClick(event, currentRouteIndex, {
                        startLocation,
                        endLocation,
                        startIndex,
                        endIndex,
                      })
                    }
                  >
                    <ConfirmationNumberOutlinedIcon />
                  </IconButton>
                );
              })
            )}
          </Card>

          <Popover
            id={idPopover}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            {selectedRoute &&
              (trip.state === 0 ? (
                <Box p={2}>
                  <TextField
                    label="Số ghế"
                    type="number"
                    value={seatCount}
                    onChange={handleSeatCountChange}
                    error={!!error}
                    helperText={error}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "var(--primary-color)",
                              "&:hover": {
                                backgroundColor: "var(--hover-color)",
                              },
                            }}
                            onClick={handleAddSeat}
                            disabled={!seatCount || !!error}
                          >
                            Xác nhận
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              ) : trip.state === 1 && trip.seatsAvailable === 0 ? (
                <Box px={3} py={2}>
                  <Typography variant="p" gutterBottom>
                    Vé đã hết!
                  </Typography>
                </Box>
              ) : (
                <Box px={3} py={2}>
                  <Typography variant="p" gutterBottom>
                    Vé đã quá thời gian xuất phát!
                  </Typography>
                </Box>
              ))}
          </Popover>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Box p={3} display="flex" flexDirection="column">
              <Typography variant="h5" mb={3} gutterBottom>
                Thông tin vé
              </Typography>

              <Typography
                variant="p"
                mb={3}
                color="textSecondary"
                component="span"
              >
                Tuyến đường:{" "}
                <Typography
                  variant="p"
                  sx={{ color: "var(--text-color)", lineHeight: "24px" }}
                  component="span"
                >
                  {selectedRoute
                    ? ` ${selectedRoute.startLocation} - ${selectedRoute.endLocation}`
                    : ""}
                </Typography>
              </Typography>

              <Typography
                variant="p"
                mb={3}
                color="textSecondary"
                component="span"
              >
                Ngày xuất phát:{" "}
                <Typography
                  variant="p"
                  mb={1}
                  sx={{ color: "var(--text-color)" }}
                  component="span"
                >
                  {" "}
                  {new Date(trip.departureTime).toLocaleString()}
                </Typography>
              </Typography>

              <Typography
                variant="p"
                mb={3}
                color="textSecondary"
                component="span"
              >
                Loại xe:{" "}
                <Typography
                  variant="p"
                  sx={{ color: "var(--text-color)" }}
                  mb={1}
                  component="span"
                >
                  {`  ${trip.seatsAvailable} chỗ `}
                </Typography>
              </Typography>

              <Typography
                variant="p"
                mb={3}
                color="textSecondary"
                component="span"
              >
                Số ghế trống:{" "}
                <Typography
                  variant="p"
                  sx={{ color: "var(--text-color)" }}
                  mb={1}
                  component="span"
                >
                  {` ${trip.seatsAvailable}`}
                </Typography>
              </Typography>

              <Typography
                variant="p"
                mb={3}
                color="textSecondary"
                component="span"
              >
                Số ghế đã chọn:{" "}
                <Typography
                  variant="p"
                  sx={{ color: "var(--text-color)" }}
                  mb={1}
                  component="span"
                >
                  {` ${seatOrder}`}
                </Typography>
              </Typography>

              <Typography
                variant="p"
                mb={3}
                color="textSecondary"
                component="span"
              >
                Giá vé:{" "}
                <Typography
                  variant="p"
                  sx={{ color: "var(--text-color)" }}
                  mb={1}
                  component="span"
                >
                  {selectedRoute ? ` ${formattedAmount}VND` : ""}
                </Typography>
              </Typography>
              {seatOrder ? (
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: 3,
                    backgroundColor: "var(--primary-color)",
                    "&:hover": {
                      backgroundColor: "var(--hover-color)",
                    },
                  }}
                  onClick={handlePayment} // Gọi hàm xử lý thanh toán
                >
                  Thanh toán
                </Button>
              ) : (
                ""
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" mb={3}>
            <Typography variant="h5">Đánh giá chuyến đi</Typography>
            <Rating
              name="trip-rating"
              value={rating}
              onChange={handleRatingChange} // Handle rating change
              sx={{ mb: 2, mt: 1 }}
            />
            <TextField
              label="Viết đánh giá của bạn"
              multiline
              rows={4}
              value={review}
              onChange={handleReviewChange} // Handle review text change
              variant="outlined"
              sx={{ mb: 1 }}
              fullWidth
            />
            {showIncompleteTripMessage && (
              <Typography variant="caption" sx={{ color: "var(--red)", ml: 1 }}>
                {isEligibleToReview
                  ? "Bạn chưa thể đánh giá do chuyến đi chưa kết thúc"
                  : "Bạn không thể đánh giá vì bạn không phải là khách hàng của chuyến đi này"}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleRatingSubmit} // Submit the rating
              sx={{
                mb: 3,
                mt: 2,
                borderRadius: 3,
                backgroundColor: "var(--primary-color)",
                "&:hover": {
                  backgroundColor: "var(--hover-color)",
                },
              }}
              disabled={rating === 0 || trip.state !== 7}
            >
              Gửi đánh giá
            </Button>
            {reviews
              .slice()
              .reverse()
              .slice(0, visibleReviews)
              .map((review, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar
                      sx={{
                        mr: 2,
                        width: "40px",
                        height: "40px",
                        cursor: "pointer",
                        transition: "all linear 0.3s",
                        "&:hover": { opacity: 0.7 },
                      }}
                      src={`http://localhost:8080${review.user.avatar}`}
                      onClick={() => {
                        navigate(`/forum-profile/${review.user._id}`);
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          "&:hover": {
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                        }}
                        variant="body1"
                        mb="2px"
                        gutterBottom
                        onClick={() => {
                          navigate(`/forum-profile/${review.user._id}`);
                        }}
                      >
                        {review.user.firstName} {review.user.lastName}
                      </Typography>

                      <Rating
                        sx={{ width: "10px" }}
                        value={review.rating}
                        size="small"
                        readOnly
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(review.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              ))}

            {/* Show "See more" button if there are more reviews */}
            {visibleReviews < reviews.length && (
              <Typography
                variant="body1"
                onClick={loadMoreReviews}
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  color: "var(--primary-color)",
                  "&:hover": {
                    color: "var(--hover-color)",
                  },
                }}
              >
                Xem thêm
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
      <ImagePreview
        open={openModal}
        imageUrl={selectedImage}
        onClose={handleCloseModalImage}
      />
    </Container>
  );
};

export default TicketDetail;
