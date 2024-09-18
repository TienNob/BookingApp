import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Grid, Container } from "@mui/material";
import axios from "axios";

function MyTicket() {
  const [tickets, setTickets] = useState([]); // Initialize as an empty array
  const userId = localStorage.getItem("userId");

  // Fetch ticket data from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tickets"); // API lấy toàn bộ vé
        const fetchedTickets = response.data;

        // Lọc ra tất cả các vé có ticket.user._id trùng với userId
        const userTickets = fetchedTickets.filter((ticket) => {
          console.log(ticket.user._id, userId); // Kiểm tra log để đảm bảo bạn đang so sánh đúng
          return ticket.user._id === userId; // So sánh ticket.user._id với userId
        });

        // Set state với danh sách vé đã lọc
        setTickets(userTickets);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchTickets();
  }, [userId]); // Chạy lại nếu userId thay đổi

  if (tickets.length === 0) {
    return (
      <Typography
        sx={{
          marginTop: "100px",
        }}
      >
        Không có vé nào của bạn.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        marginTop: "100px",
      }}
    >
      <Container>
        <Grid container spacing={2}>
          {tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={ticket._id}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  mb: 2, // Add margin between tickets
                  height: "100%",
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

                <Divider sx={{ mt: 2, mb: 2 }} />

                <Typography variant="body2" color="textSecondary">
                  Ngày mua vé:{" "}
                  {new Date(ticket.purchaseTime).toLocaleString("vi-VN")}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default MyTicket;
