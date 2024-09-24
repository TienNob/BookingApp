import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Grid,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AdminOverview() {
  const [userData, setUserData] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [lastWeekTripCount, setLastWeekTripCount] = useState(0);
  const [lastWeekTicketCount, setLastWeekTicketCount] = useState(0);
  const [lastWeekUserCount, setLastWeekUserCount] = useState(0);
  const [filteredData, setFilteredData] = useState({
    labels: [],
    datasets: [],
  });
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/trips");
        const trips = response.data;

        setTripCount(trips.length);

        // Tính số lượng chuyến đi trong 7 ngày trước
        const lastWeekTrips = trips.filter((trip) =>
          dayjs(trip.createdAt).isAfter(dayjs().subtract(7, "day"))
        );

        setLastWeekTripCount(lastWeekTrips.length);
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchTripData();
  }, []);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/tickets");
        const tickets = response.data;

        setTicketCount(tickets.length);

        // Tính số lượng vé bán trong 7 ngày trước
        const lastWeekTickets = tickets.filter((ticket) =>
          dayjs(ticket.createdAt).isAfter(dayjs().subtract(7, "day"))
        );

        setLastWeekTicketCount(lastWeekTickets.length);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };

    fetchTicketData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/all");
        const users = response.data;
        setUserData(users);

        // Tính số lượng người dùng trong 7 ngày trước
        const lastWeekUsers = users.filter((user) =>
          dayjs(user.createdAt).isAfter(dayjs().subtract(7, "day"))
        );
        setLastWeekUserCount(lastWeekUsers.length);

        processUserGrowth(users, timeRange);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [timeRange]);

  const processUserGrowth = (users, range) => {
    const growthData = users.reduce((acc, user) => {
      const createdAt = dayjs(user.createdAt);
      let key;

      if (range === "month") {
        key = `${createdAt.year()}-${createdAt.month() + 1}`;
      } else {
        key = createdAt.format("YYYY-MM-DD");
      }

      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    }, {});

    let labels = [];
    let counts = [];

    if (range === "month") {
      labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
      counts = labels.map((_, i) => {
        const key = `${dayjs().year()}-${i + 1}`;
        return growthData[key] || 0;
      });
    } else {
      const daysInMonth = dayjs().daysInMonth();
      labels = Array.from({ length: daysInMonth }, (_, i) => `Ngày ${i + 1}`);
      counts = labels.map((_, i) => {
        const key = dayjs()
          .date(i + 1)
          .format("YYYY-MM-DD");
        return growthData[key] || 0;
      });
    }

    setFilteredData({
      labels,
      datasets: [
        {
          label: "Số lượng người dùng",
          data: counts,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    });
  };

  const calculateGrowth = (current, lastWeek) => {
    if (lastWeek === 0) return "N/A"; // Nếu tuần trước không có dữ liệu
    const growth = ((current - lastWeek) / lastWeek) * 100;
    const sign = growth > 0 ? "+" : growth < 0 ? "-" : "";
    return `${sign}${growth.toFixed(1)}%`;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
        text: "Số Lượng Người Dùng Mới",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tổng quan
      </Typography>
      <Grid mb={4} container spacing={3}>
        {/* Paper 1: Tổng số người dùng */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 5 }}>
            <Typography sx={{ color: "var(--text-color)" }} variant="p">
              Tổng số người dùng
            </Typography>
            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ color: "var(--text-color)" }} variant="h4">
                {userData.length}
              </Typography>
              <BarChartIcon
                sx={{ fontSize: 40, color: "var(--secondary-color)" }}
              />
            </Box>
            <Typography
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
              variant="caption"
            >
              {lastWeekUserCount !== 0 && (
                <ArrowDropUpIcon
                  sx={{
                    color:
                      userData.length > lastWeekUserCount
                        ? "var(--primary-color)"
                        : userData.length < lastWeekUserCount
                        ? "var(--red)"
                        : "grey",
                    transform:
                      userData.length < lastWeekUserCount
                        ? "rotate(180deg)"
                        : "none",
                  }}
                />
              )}{" "}
              {calculateGrowth(userData.length, lastWeekUserCount)}
              <Typography
                variant="caption"
                sx={{ color: "var(--grey)", ml: 1 }}
              >
                7 ngày trước{" "}
              </Typography>
            </Typography>
          </Paper>
        </Grid>

        {/* Paper 2: Tổng chuyến đi */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 5 }}>
            <Typography sx={{ color: "var(--text-color)" }} variant="p">
              Tổng số người dùng
            </Typography>
            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ color: "var(--text-color)" }} variant="h4">
                {tripCount}
              </Typography>
              <BarChartIcon
                sx={{ fontSize: 40, color: "var(--primary-color)" }}
              />
            </Box>
            <Typography
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
              variant="caption"
            >
              {lastWeekUserCount !== 0 && (
                <ArrowDropUpIcon
                  sx={{
                    color:
                      tripCount > lastWeekUserCount
                        ? "var(--primary-color)"
                        : tripCount < lastWeekUserCount
                        ? "var(--red-color)"
                        : "grey",
                    transform:
                      tripCount < lastWeekUserCount ? "rotate(180deg)" : "none",
                  }}
                />
              )}{" "}
              {calculateGrowth(tripCount, lastWeekUserCount)}
              <Typography
                variant="caption"
                sx={{ color: "var(--grey)", ml: 1 }}
              >
                7 ngày trước{" "}
              </Typography>
            </Typography>
          </Paper>
        </Grid>

        {/* Paper 3: Tổng số vé */}
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 5 }}>
            <Typography sx={{ color: "var(--text-color)" }} variant="p">
              Tổng số vé đã bán
            </Typography>
            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ color: "var(--text-color)" }} variant="h4">
                {ticketCount}
              </Typography>
              <BarChartIcon sx={{ fontSize: 40, color: "var(--red)" }} />
            </Box>
            <Typography
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
              variant="caption"
            >
              {lastWeekUserCount !== 0 && (
                <ArrowDropUpIcon
                  sx={{
                    color:
                      ticketCount > lastWeekUserCount
                        ? "var(--primary-color)"
                        : ticketCount < lastWeekUserCount
                        ? "var(--red-color)"
                        : "grey",
                    transform:
                      ticketCount < lastWeekUserCount
                        ? "rotate(180deg)"
                        : "none",
                  }}
                />
              )}{" "}
              {calculateGrowth(ticketCount, lastWeekUserCount)}
              <Typography
                variant="caption"
                sx={{ color: "var(--grey)", ml: 1 }}
              >
                7 ngày trước{" "}
              </Typography>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Số Lượng Người Dùng Mới
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="day">Ngày</MenuItem>
            <MenuItem value="month">Tháng</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Biểu đồ */}
      <Line data={filteredData} options={options} />
      {/* Button Group để chọn khoảng thời gian */}
    </Box>
  );
}

export default AdminOverview;
