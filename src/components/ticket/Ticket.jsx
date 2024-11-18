import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Container,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Slider,
  Divider,
  Select,
  Autocomplete,
  Pagination,
  MenuItem,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Ticket = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [originalTrips, setOriginalTrips] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [seatRangeFilters, setSeatRangeFilters] = useState([]);
  const [timeRange, setTimeRange] = useState([0, 24]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("hoat_dong");
  const itemsPerPage = 10;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialDeparture = queryParams.get("departure");
  const initialDestination = queryParams.get("destination");
  const navigate = useNavigate();
  console.log(initialDeparture, initialDestination);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/trips");
        const tripsData = response.data;
        const activeTrips = tripsData.filter((trip) => trip.state === 0);

        // Sắp xếp dữ liệu theo ngày khởi hành
        const activeTrip = activeTrips.sort((a, b) => {
          const dateA = new Date(a.departureTime);
          const dateB = new Date(b.departureTime);
          return dateA - dateB; // Tăng dần
        });
        // Sắp xếp dữ liệu theo ngày khởi hành
        const sortedTrips = tripsData.sort((a, b) => {
          const dateA = new Date(a.departureTime);
          const dateB = new Date(b.departureTime);
          return dateA - dateB; // Tăng dần
        });

        setTrips(sortedTrips);
        setFilteredTrips(activeTrip);
        setOriginalTrips(sortedTrips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://esgoo.net/api-tinhthanh/1/0.htm"
        );
        const allProvinces = response.data.data.map(
          (province) => province.name
        );
        setProvinces(allProvinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchTrips();
    fetchProvinces();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [seatRangeFilters, timeRange, selectedStatus]);

  const filterTrips = () => {
    const filtered = trips.filter((trip) => {
      const matchSeats = seatRangeFilters.length
        ? seatRangeFilters.some((range) => {
            if (range === "<7") return trip.totalSeats < 7;
            if (range === "7-16")
              return trip.totalSeats >= 7 && trip.totalSeats <= 16;
            if (range === ">16") return trip.totalSeats > 16;
            return false;
          })
        : true;
      const matchTime =
        new Date(trip.departureTime).getHours() >= timeRange[0] &&
        new Date(trip.departureTime).getHours() <= timeRange[1];
      const matchStatus =
        selectedStatus === "hoat_dong"
          ? trip.state === 0
          : selectedStatus === "ngung_hoat_dong"
          ? trip.state === 1
          : selectedStatus === "dang_khoi_hanh"
          ? trip.state > 1 && trip.state < 7
          : selectedStatus === "hoan_thanh"
          ? trip.state === 7
          : true;

      return matchSeats && matchTime && matchStatus;
    });
    setFilteredTrips(filtered);
  };

  const handleSeatRangeChange = (event) => {
    const value = event.target.name;
    setSeatRangeFilters((prev) =>
      prev.includes(value)
        ? prev.filter((range) => range !== value)
        : [...prev, value]
    );
  };

  // Add a handler for the status filter
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    filterTrips(); // Update the trips displayed
  };
  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  const handleSearch = () => {
    const filtered = originalTrips.filter((trip) => {
      const matchDeparture = selectedDeparture
        ? trip.locations.some((location) =>
            location.includes(selectedDeparture)
          )
        : true;
      const matchDestination = selectedDestination
        ? trip.locations.some((location) =>
            location.includes(selectedDestination)
          )
        : true;
      const matchDate = departureDate
        ? new Date(trip.departureTime).toLocaleDateString() ===
          new Date(departureDate).toLocaleDateString()
        : true;

      return matchDeparture && matchDestination && matchDate;
    });
    setTrips(filtered);
    setFilteredTrips(filtered);
  };

  const extractLocation = (location, locationsArray) => {
    const parts = location.split(", ");
    const province = parts[parts.length - 1];
    const district = parts[parts.length - 2];
    const commune = parts[parts.length - 3];

    // Kiểm tra nếu có sự trùng lặp của tỉnh
    const isProvinceDuplicated = locationsArray.some(
      (loc) => loc.includes(province) && loc !== location
    );

    if (isProvinceDuplicated) {
      // Kiểm tra nếu có sự trùng lặp của huyện
      const isDistrictDuplicated = locationsArray.some(
        (loc) => loc.includes(district) && loc !== location
      );

      if (isDistrictDuplicated) {
        // Nếu trùng cả tỉnh và huyện, trả về cả xã
        return `${commune}, ${district}, ${province}`;
      }
      // Nếu chỉ trùng tỉnh, trả về cả huyện
      return `${district}, ${province}`;
    }

    // Trả về tên tỉnh nếu không trùng
    return province;
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  // Calculate total pages
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  // Slice the trips based on the current page
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleViewDetails = (tripId) => {
    navigate(`/ticket-detail/${tripId}`);
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: "100px" }}>
      <Container>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option}
              value={selectedDestination || initialDestination || ""}
              onChange={(event, newValue) => setSelectedDeparture(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Điểm khởi hành"
                  variant="outlined"
                />
              )}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              options={provinces}
              getOptionLabel={(option) => option}
              value={selectedDestination || initialDestination || ""}
              onChange={(event, newValue) => setSelectedDestination(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Điểm đến" variant="outlined" />
              )}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Ngày khởi hành"
                value={departureDate}
                onChange={(newValue) => setDepartureDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Button
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: "var(--primary-color)",
                "&:hover": {
                  backgroundColor: "var(--hover-color)",
                },
                mr: 1,
              }}
              onClick={handleSearch}
            >
              <SearchOutlinedIcon /> Tìm kiếm
            </Button>
            <Button
              sx={{
                backgroundColor: "var(--grey)",
                "&:hover": {
                  backgroundColor: "var(--subtext-color)",
                },
              }}
              variant="contained"
              onClick={() => {
                setSelectedDeparture(null);
                setSelectedDestination(null);
                setDepartureDate(null);
                setTrips(originalTrips);
                setFilteredTrips(originalTrips);
                setSelectedStatus("");
                navigate({
                  pathname: window.location.pathname, // Keep the same path
                  search: "", // Clear query parameters
                });
              }}
            >
              <RestartAltOutlinedIcon />
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bộ lọc
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Trạng thái chuyến đi
            </Typography>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="hoat_dong">Hoạt động</MenuItem>
              <MenuItem value="ngung_hoat_dong">Ngưng hoạt động</MenuItem>
              <MenuItem value="dang_khoi_hanh">Đang khởi hành</MenuItem>
              <MenuItem value="hoan_thanh">Đã hoàn thành</MenuItem>
            </Select>
            <Divider sx={{ mb: 2, mt: 2 }} />

            <Typography variant="body1" sx={{ mb: 1 }}>
              Loại xe (Số ghế)
            </Typography>
            <FormGroup>
              {[
                { label: "<7 chỗ", value: "<7" },
                { label: "7-16 chỗ", value: "7-16" },
                { label: ">16 chỗ", value: ">16" },
              ].map((range) => (
                <FormControlLabel
                  key={range.value}
                  control={
                    <Checkbox
                      sx={{
                        color: "var(--secondary-color)",
                        "&.Mui-checked": {
                          color: "var(--secondary-color)",
                        },
                      }}
                      name={range.value}
                      checked={seatRangeFilters.includes(range.value)}
                      onChange={handleSeatRangeChange}
                    />
                  }
                  label={range.label}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              Thời gian khởi hành (giờ)
            </Typography>
            <Slider
              value={timeRange}
              onChange={handleTimeRangeChange}
              sx={{ color: "var(--secondary-color)" }}
              valueLabelDisplay="auto"
              min={0}
              max={24}
              marks={[
                { value: 0, label: "0h" },
                { value: 6, label: "6h" },
                { value: 12, label: "12h" },
                { value: 18, label: "18h" },
                { value: 24, label: "24h" },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {paginatedTrips.length > 0 ? (
                paginatedTrips.map((trip) => (
                  <Grid item xs={12} key={trip._id}>
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={5}>
                            <Typography
                              variant="h6"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              {trip.locations
                                .map((location) =>
                                  extractLocation(location, trip.locations)
                                )
                                .reduce(
                                  (acc, curr, index, array) => (
                                    <>
                                      {acc}
                                      {curr}
                                      {index < array.length - 1 && (
                                        <EastOutlinedIcon
                                          sx={{
                                            mx: 1,
                                            color: "var(--primary-color)",
                                          }}
                                        />
                                      )}
                                    </>
                                  ),
                                  []
                                )}
                            </Typography>
                            <Typography
                              variant="p"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <ChairOutlinedIcon
                                sx={{ mr: 1, color: "var(--primary-color)" }}
                              />
                              Số chỗ: {trip.totalSeats}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="p"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <AccessTimeIcon
                                sx={{ mr: 1, color: "var(--primary-color)" }}
                              />
                              Thời gian khởi hành
                            </Typography>
                            <Typography variant="h6">
                              {trip.departureTime
                                ? new Date(trip.departureTime).toLocaleString()
                                : "Không có thời gian"}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={3}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  trip.state === 0
                                    ? "textSecondary"
                                    : "var(--red)",
                              }}
                            >
                              Số ghế trống: {trip.seatsAvailable}
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={() => handleViewDetails(trip._id)}
                              sx={{
                                mt: 1,
                                backgroundColor:
                                  trip.state === 0
                                    ? "var(--primary-color)"
                                    : "var(--red)",
                                "&:hover": {
                                  backgroundColor:
                                    trip.state === 0
                                      ? "var(--hover-color)"
                                      : "var(--dark-red)",
                                },
                              }}
                            >
                              Xem chi tiết
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1">
                  Không tìm thấy chuyến đi
                </Typography>
              )}
            </Grid>{" "}
            {/* Pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                marginBottom: "40px",
              }}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Ticket;
