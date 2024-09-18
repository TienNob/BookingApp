import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
  Typography,
  Container,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Loadding from "../Loadding";
import axios from "axios";

const TripTable = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({}); // For handling open/close state of each row
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filter, setFilter] = useState("all"); // Filter state
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch trips from the API
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/trips/my-trips/${userId}`)
      .then((response) => {
        setTrips(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load trips");
        setLoading(false);
      });
  }, [userId]);

  const handleViewDetail = (tripId) => {
    navigate(`/ticket-detail/${tripId}`);
  };
  // Toggle row open/close state
  const handleRowClick = (tripId) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [tripId]: !prevOpenRows[tripId],
    }));
  };
  const filteredTrips = trips
    .filter((trip) => {
      if (filter === "all") return true;
      return filter === "active" ? trip.state === 0 : trip.state !== 0;
    })
    .filter((trip) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        trip._id.toLowerCase().includes(searchLower) ||
        trip.locations.join(" -> ").toLowerCase().includes(searchLower)
      );
    });

  const filterOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Hoạt động", value: "active" },
    { label: "Ngưng hoạt động", value: "inactive" },
  ];

  if (loading) {
    return <Loadding />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container sx={{ mt: "100px" }}>
      <Box sx={{ mb: 2, display: "flex" }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2, mr: 2 }}
        />
        <Autocomplete
          options={filterOptions}
          getOptionLabel={(option) => option.label}
          value={
            filterOptions.find((option) => option.value === filter) || null
          }
          onChange={(event, newValue) => {
            if (newValue) {
              setFilter(newValue.value);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Trạng thái" variant="outlined" />
          )}
          sx={{ width: 200 }}
        />
      </Box>

      <TableContainer
        sx={{ maxWidth: "100%", overflowX: "auto" }}
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell sx={{ minWidth: 200 }}>Mã chuyến đi</TableCell>
              <TableCell sx={{ minWidth: 300 }}>Địa điểm</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Tổng số chỗ</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Số chỗ trống</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Thời gian xuất phát</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Trạng thái</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Xem chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrips.map((trip) => (
              <React.Fragment key={trip._id}>
                {/* Main trip row */}
                <TableRow>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(trip._id)}
                    >
                      {openRows[trip._id] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{trip._id}</TableCell>
                  <TableCell>{trip.locations.join(" -> ")}</TableCell>
                  <TableCell>{trip.totalSeats}</TableCell>
                  <TableCell>{trip.seatsAvailable}</TableCell>
                  <TableCell>
                    {new Date(trip.departureTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {trip.state === 0 ? "Hoạt động" : "Ngưng hoạt động"}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "var(--primary-color)",
                      textDecoration: "underline",
                      transition: "all ease 0.3s",
                      "&:hover": {
                        cursor: "pointer",
                        color: "var(--hover-color)",
                      },
                    }}
                    onClick={() => handleViewDetail(trip._id)}
                  >
                    Xem thêm
                  </TableCell>
                </TableRow>

                {/* Collapsible row for showing purchased tickets */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={8}
                  >
                    <Collapse
                      in={openRows[trip._id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Vé Đã Bán
                        </Typography>
                        {trip.tickets && trip.tickets.length > 0 ? (
                          <Table size="small" aria-label="purchased tickets">
                            <TableHead>
                              <TableRow>
                                <TableCell>Người mua</TableCell>
                                <TableCell>Địa điểm đã chọn</TableCell>
                                <TableCell>Số ghế đã mua</TableCell>
                                <TableCell>Tổng tiền (VND)</TableCell>
                                <TableCell>Thời gian mua vé</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {trip.tickets
                                .slice()
                                .reverse()
                                .map((ticket, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{ticket.user}</TableCell>
                                    <TableCell>{ticket.location}</TableCell>
                                    <TableCell>
                                      {ticket.seatsPurchased}
                                    </TableCell>
                                    <TableCell>{ticket.amountPaid}</TableCell>
                                    <TableCell>
                                      {" "}
                                      {new Date(
                                        ticket.purchaseTime
                                      ).toLocaleString()}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography>Chưa có người mua vé nào!</Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TripTable;
