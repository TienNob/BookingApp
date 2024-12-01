import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import axios from "axios";
import { useSnackbar } from "notistack";

function MyTicket() {
  const [tickets, setTickets] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null); // Menu anchor element
  const [selectedTicketId, setSelectedTicketId] = useState(null); // Selected ticket for menu actions
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" means no filter
  const userId = localStorage.getItem("userId");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Fetch ticket data from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tickets");
        const fetchedTickets = response.data;

        const userTickets = fetchedTickets.filter((ticket) => {
          console.log(ticket.user._id === userId);
          return ticket.user._id === userId;
        });

        setTickets(userTickets);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchTickets();
  }, [userId]);
  const filteredTickets = tickets.filter((ticket) => {
    // Tìm kiếm dựa trên mã vé hoặc tuyến đường
    const matchSearchTerm =
      ticket._id.includes(searchTerm) ||
      ticket.location
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase());

    // Lọc theo trạng thái vé
    const matchStatusFilter =
      statusFilter === "" ||
      (statusFilter === "active" && ticket.state === 0) ||
      (statusFilter === "cancelled" && ticket.state === 1);

    return matchSearchTerm && matchStatusFilter;
  });

  // Handle menu open
  const handleMenuOpen = (event, ticketId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicketId(ticketId);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTicketId(null);
  };

  // Handle cancel ticket
  const handleCancelTicket = async () => {
    try {
      // Fetch the selected ticket to get trip departure time
      const selectedTicket = tickets.find(
        (ticket) => ticket._id === selectedTicketId
      );

      if (!selectedTicket) {
        enqueueSnackbar("Vé không tồn tại.", { variant: "error" });
        return;
      }

      // Get the departure time of the trip
      const departureTime = new Date(selectedTicket.trip.departureTime);
      const currentTime = new Date();

      // Calculate the difference between the current time and the departure time
      const timeDifference = departureTime - currentTime;
      const hoursBeforeDeparture = timeDifference / (1000 * 60 * 60); // Convert to hours

      // Check if the cancellation is within 24 hours
      if (hoursBeforeDeparture < 24) {
        enqueueSnackbar("Không thể hủy vé trước 24 tiếng giờ khởi hành.", {
          variant: "error",
        });
        return; // Exit if within 24 hours of departure
      }

      // Proceed with cancellation if outside the 24-hour window
      await axios.delete(
        `http://localhost:8080/api/tickets/${selectedTicketId}`
      );
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== selectedTicketId)
      );
      enqueueSnackbar("Hủy vé thành công!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Lỗi khi hủy vé!", { variant: "error" });
      console.error("Error cancelling ticket:", error);
    } finally {
      handleMenuClose();
    }
  };

  if (tickets.length === 0) {
    return (
      <Typography sx={{ marginTop: "100px" }}>
        Không có vé nào của bạn.
      </Typography>
    );
  }

  return (
    <Box sx={{ marginTop: "100px" }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={10} sm={10} mb={2}>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={2} sm={2}>
            <Autocomplete
              options={[
                { label: "Tất cả", value: "" },
                { label: "Hoạt động", value: "active" },
                { label: "Đã hủy", value: "cancelled" },
              ]}
              getOptionLabel={(option) => option.label}
              value={{ label: "Tất cả", value: "" }}
              onChange={(event, newValue) => {
                setStatusFilter(newValue ? newValue.value : ""); // Set status filter
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lọc theo trạng thái"
                  variant="outlined"
                  sx={{ width: "100%" }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {filteredTickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={ticket._id}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  mb: 2,
                  height: "100%",
                  position: "relative", // Make the box relative for positioning the menu
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Thông tin vé
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="body1" sx={{ mt: 1 }}>
                  Mã vé:{" "}
                  <span style={{ color: "var(--secondary-color)" }}>
                    {ticket._id}
                  </span>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Tuyến đường:{" "}
                  <span style={{ color: "var(--secondary-color)" }}>
                    {ticket.location}
                  </span>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Số ghế đã mua:{" "}
                  <span style={{ color: "var(--secondary-color)" }}>
                    {ticket.seatsPurchased}
                  </span>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Số tiền đã thanh toán:{" "}
                  <span style={{ color: "var(--secondary-color)" }}>
                    {ticket.amountPaid} VND
                  </span>{" "}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Thời gian khởi hành:{" "}
                  <span style={{ color: "var(--secondary-color)" }}>
                    {new Date(ticket.departureTime).toLocaleString("vi-VN")}
                  </span>{" "}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Trạng thái:{" "}
                  <span
                    style={{
                      color:
                        ticket.state === 0
                          ? "var(--primary-color)"
                          : "var(--red)",
                    }}
                  >
                    {ticket.state === 1 ? "Đã huỷ" : "Hoạt động"}
                  </span>{" "}
                </Typography>

                <Divider sx={{ mt: 2, mb: 2 }} />

                <Typography variant="body2" color="textSecondary">
                  Ngày mua vé:{" "}
                  {new Date(ticket.purchaseTime).toLocaleString("vi-VN")}
                </Typography>

                {/* Icon button to trigger menu */}
                <IconButton
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={(event) => handleMenuOpen(event, ticket._id)}
                >
                  <MoreVertIcon />
                </IconButton>

                {/* Menu for actions */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl) && selectedTicketId === ticket._id}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    sx={{ px: 2, py: 1 }}
                    onClick={() => {
                      navigate(`/ticket-detail/${ticket.trip._id}`);

                      handleMenuClose();
                    }}
                  >
                    <VisibilityIcon sx={{ mr: 1 }} /> Xem chi tiết
                  </MenuItem>
                  <MenuItem
                    sx={{ px: 2, py: 1 }}
                    disabled={ticket.trip.state < 2}
                    onClick={() => {
                      navigate(`/trip-table/${ticket.trip._id}`);
                      handleMenuClose();
                    }}
                  >
                    <DirectionsRunIcon sx={{ mr: 1 }} /> Xem tiến trình
                  </MenuItem>
                  <MenuItem
                    sx={{ px: 2, py: 1, color: "var(--red)" }}
                    onClick={handleCancelTicket}
                  >
                    <DeleteIcon sx={{ mr: 1 }} />
                    Hủy vé
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default MyTicket;
