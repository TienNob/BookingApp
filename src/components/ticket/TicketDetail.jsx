import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
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
  Link,
} from "@mui/material";
import axios from "axios";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
const TicketDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [trip, setTrip] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [seatCount, setSeatCount] = useState("");
  const [seatOrder, setSeatOrder] = useState("");
  const [error, setError] = useState("");
  const [activeButtonId, setActiveButtonId] = useState(null);
  console.log(activeButtonId);
  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/trips/${id}`
        );
        setTrip(response.data);
      } catch (error) {
        console.error("Error fetching trip detail:", error);
      }
    };

    fetchTripDetail();
  }, [id]);
  console.log(selectedRoute);
  const handleSeatCountChange = (event) => {
    const value = event.target.value;
    if (selectedRoute) {
      const availableSeats = trip.seatsAvailable;
      if (parseInt(value) > availableSeats) {
        setError(`Số ghế không được vượt quá ${availableSeats} ghế trống.`);
      } else {
        setError("");
      }
      setSeatCount(value);
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
  const open = Boolean(anchorEl);
  const idPopover = open ? "simple-popover" : undefined;

  if (!trip) return <Typography variant="h6">Loading...</Typography>;

  const locations = trip.locations;
  const prices =
    trip.prices.map((price) =>
      Math.round(price).toLocaleString("en-US").replace(/,/g, ".")
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
    <Container sx={{ mt: "100px" }}>
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
            {selectedRoute && (
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
            )}
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
                  {selectedRoute
                    ? ` ${prices[activeButtonId] * seatOrder} VND`
                    : ""}
                </Typography>
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TicketDetail;
