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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Loadding from "../Loadding";
import axios from "axios";
import { useSnackbar } from "notistack";
import EditTripDialog from "../admin/adminTrip/EditTripDialog";
const TripTable = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRows, setOpenRows] = useState({}); // For handling open/close state of each row
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [filter, setFilter] = useState("all"); // Filter state
  const [anchorEl, setAnchorEl] = useState(null); // For handling menu open state
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

  const tripSelect = trips.filter((t) => t._id === selectedTrip);

  const handleViewDetail = (tripId) => {
    navigate(`/ticket-detail/${tripId}`);
  };
  const handleStart = (tripId) => {
    setLoading(true);

    if (tripSelect[0].state > 2) {
      navigate(`/trip-table/${tripId}`);
      return;
    }
    axios
      .patch(
        `http://localhost:8080/api/trips/${tripId}/state`,
        { state: 2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        enqueueSnackbar("Cập nhật trạng thái thành công!", {
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Error updating state:", error);
        enqueueSnackbar("Có lỗi xảy ra!", { variant: "error" }); // Use enqueueSnackbar
      })
      .finally(() => {
        setLoading(false);
      });
    navigate(`/trip-table/${tripId}`);
  };
  const handleEdit = (tripId) => {
    const tripToEdit = trips.find((trip) => trip._id === tripId); // Find the trip by tripId
    setSelectedTrip(tripToEdit);
    setOpenDialog(true);
    setAnchorEl(null);
  };
  console.log(selectedTrip);

  const handleDelete = (tripId) => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTrips(trips.filter((trip) => trip._id !== tripId));
        setAnchorEl(null);

        enqueueSnackbar("Xóa chuyến đi thành công", { variant: "success" });
      })
      .catch((error) => {
        console.error("Có lỗi khi xóa chuyến đi!", error);
        enqueueSnackbar("Lỗi khi xóa chuyến đi", { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // Handle menu actions
  const handleMenuOpen = (event, tripId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrip(tripId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTrip(null);
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
    { label: "Ngưng bán", value: "inactive" },
  ];

  if (loading) {
    return <Loadding />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container sx={{ mt: "100px", mb: 4 }}>
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
              <TableCell sx={{ minWidth: 100 }}>Hành động</TableCell>
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
                    {trip.state === 0
                      ? "Hoạt động"
                      : trip.state === 1
                      ? "Ngưng bán"
                      : trip.state >= 2 && trip.state <= 6
                      ? "Đang diễn ra"
                      : "Đã hoàn thành"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, trip._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        sx={{ px: 2, py: 1 }}
                        onClick={() => handleViewDetail(selectedTrip)}
                      >
                        <VisibilityIcon sx={{ mr: 1 }} /> Xem chi tiết
                      </MenuItem>
                      <MenuItem
                        sx={{ px: 2, py: 1 }}
                        onClick={() => handleEdit(selectedTrip)}
                      >
                        <EditIcon sx={{ mr: 1 }} /> Chỉnh sửa
                      </MenuItem>
                      <MenuItem
                        sx={{ px: 2, py: 1 }}
                        onClick={() => handleStart(selectedTrip)}
                      >
                        <DirectionsRunIcon sx={{ mr: 1 }} />
                        {tripSelect &&
                        tripSelect.length > 0 &&
                        tripSelect[0].state < 2
                          ? "Bắt đầu chuyến đi"
                          : "Xem tiến trình"}
                      </MenuItem>
                      <MenuItem
                        sx={{ color: "var(--red)", px: 2, py: 1 }}
                        onClick={() => handleDelete(selectedTrip)}
                      >
                        <DeleteIcon sx={{ mr: 1 }} /> Xóa
                      </MenuItem>
                    </Menu>
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
                                .filter((ticket) => ticket.state === 0)
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
      <EditTripDialog
        open={openDialog}
        onClose={handleCloseDialog}
        trip={selectedTrip}
        token={token}
        rows={trips}
        setRows={setTrips}
      />
    </Container>
  );
};

export default TripTable;
