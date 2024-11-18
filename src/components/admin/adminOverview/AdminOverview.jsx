import React, { useEffect, useState } from "react";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  Box,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { TurnedInNotRounded } from "@mui/icons-material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

  ArcElement
);

function AdminOverview() {
  const [userData, setUserData] = useState([]);
  const [genderData, setGenderData] = useState({
    male: 0,
    female: 0,
    other: 0,
  });
  const [tripCount, setTripCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [lastWeekTripCount, setLastWeekTripCount] = useState(0);
  const [lastWeekTicketCount, setLastWeekTicketCount] = useState(0);
  const [lastWeekUserCount, setLastWeekUserCount] = useState(0);
  const [topUsers, setTopUsers] = useState([]);
  const [viewMode, setViewMode] = useState("totalCost"); // default to totalCost
  const [filteredData, setFilteredData] = useState({
    labels: [],
    datasets: [],
  });
  const [ticketStateCounts, setTicketStateCounts] = useState({
    normal: [],
    canceled: [],
    labels: [],
  });

  const [timeRange, setTimeRange] = useState("month");
  const [ticketTimeRange, setTicketTimeRange] = useState("month"); // Add time range state for tickets
  useEffect(() => {
    const FetchTransactionData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/transactions"
        );
        setTransactions(response.data.data);
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    FetchTransactionData();
  }, []);
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
        processTicketData(tickets, ticketTimeRange);
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
  }, [ticketTimeRange]);

  const processTicketData = (tickets, range) => {
    const ticketCountByState = tickets.reduce((acc, ticket) => {
      const createdAt = dayjs(ticket.createdAt);
      let key;

      if (range === "month") {
        key = `${createdAt.year()}-${createdAt.month() + 1}`; // Aggregate by month
      } else {
        key = createdAt.format("YYYY-MM-DD"); // Aggregate by day
      }

      if (!acc[key]) {
        acc[key] = { normal: 0, canceled: 0 };
      }

      if (ticket.state === 0) {
        acc[key].normal++;
      } else {
        acc[key].canceled++;
      }

      return acc;
    }, {});

    let labels = [];
    let normalCounts = [];
    let canceledCounts = [];

    if (range === "month") {
      // Generate labels for all months (Tháng 1 -> Tháng 12)
      labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
      normalCounts = labels.map((_, i) => {
        const key = `${dayjs().year()}-${i + 1}`;
        return ticketCountByState[key]?.normal || 0;
      });
      canceledCounts = labels.map((_, i) => {
        const key = `${dayjs().year()}-${i + 1}`;
        return ticketCountByState[key]?.canceled || 0;
      });
    } else {
      const daysInMonth = dayjs().daysInMonth();
      // Generate labels for each day of the current month
      labels = Array.from({ length: daysInMonth }, (_, i) => `Ngày ${i + 1}`);
      normalCounts = labels.map((_, i) => {
        const key = dayjs()
          .date(i + 1)
          .format("YYYY-MM-DD");
        return ticketCountByState[key]?.normal || 0;
      });
      canceledCounts = labels.map((_, i) => {
        const key = dayjs()
          .date(i + 1)
          .format("YYYY-MM-DD");
        return ticketCountByState[key]?.canceled || 0;
      });
    }

    // Update the state with new labels and data for the chart
    setTicketStateCounts({
      labels,
      normal: normalCounts,
      canceled: canceledCounts,
    });
  };

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
        processGenderData(users);
        const sortedUsers = users
          .filter((user) => user.totalCost !== undefined) // Lọc các user có totalCost
          .sort((a, b) => b.totalCost - a.totalCost) // Sắp xếp theo totalCost giảm dần
          .slice(0, 5); // Lấy 5 user đầu tiên

        setTopUsers(sortedUsers);
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

  const processGenderData = (users) => {
    const genderCount = { male: 0, female: 0, other: 0 };

    users.forEach((user) => {
      if (user.sex === "Nam") {
        genderCount.male++;
      } else if (user.sex === "Nữ") {
        genderCount.female++;
      } else {
        genderCount.other++;
      }
    });

    setGenderData(genderCount);
  };

  const calculateGrowth = (current, lastWeek) => {
    if (lastWeek === 0) return "Không có dữ liệu"; // Nếu tuần trước không có dữ liệu
    const growth = ((current - lastWeek) / lastWeek) * 100;
    const sign = growth > 0 ? "+" : "";
    return `${sign}${growth.toFixed(1)}%`;
  };

  const lineChartOptions = {
    responsive: TurnedInNotRounded,
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
          stepSize: 18,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom", // Vị trí của chú thích (legend)
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
      title: {
        display: false,
        text: "Phân bố giới tính người dùng",
      },
    },
  };
  const pieData = {
    labels: ["Nam", "Nữ", "Khác"],
    datasets: [
      {
        data: [genderData.male, genderData.female, genderData.other],
        backgroundColor: ["#dcf5f9", "#ffd1ba", "#fff8e0"],
        hoverBackgroundColor: ["#dcf5f9", "#ffd1ba", "#fff8e0"],
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Số giao dịch",
      },
    },
  };
  const barChartData = {
    labels: ticketStateCounts.labels,
    datasets: [
      {
        label: "Giao dịch thành công",
        data: ticketStateCounts.normal,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Giao dịch đã huỷ",
        data: ticketStateCounts.canceled,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
  };
  return (
    <Box>
      <Typography mb={2} variant="h4" gutterBottom>
        Tổng quan
      </Typography>
      <Grid mb={4} container spacing={3}>
        {/* Paper 1: Tổng số người dùng */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{ padding: 3, borderRadius: 5, height: "100%" }}
          >
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
              Tổng số chuyến đi
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
              {lastWeekTripCount !== 0 && (
                <ArrowDropUpIcon
                  sx={{
                    color:
                      tripCount > lastWeekTripCount
                        ? "var(--primary-color)"
                        : tripCount < lastWeekTripCount
                        ? "var(--red-color)"
                        : "grey",
                    transform:
                      tripCount < lastWeekTripCount ? "rotate(180deg)" : "none",
                  }}
                />
              )}{" "}
              {calculateGrowth(tripCount, lastWeekTripCount)}
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
              {lastWeekTicketCount !== 0 && (
                <ArrowDropUpIcon
                  sx={{
                    color:
                      ticketCount > lastWeekTicketCount
                        ? "var(--primary-color)"
                        : ticketCount < lastWeekTicketCount
                        ? "var(--red-color)"
                        : "grey",
                    transform:
                      ticketCount < lastWeekTicketCount
                        ? "rotate(180deg)"
                        : "none",
                  }}
                />
              )}{" "}
              {calculateGrowth(ticketCount, lastWeekTicketCount)}
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

      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Paper sx={{ p: 3, borderRadius: 5 }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ color: "var(--text-color)" }}>
                Số lượng người dùng mới
              </Typography>
              <FormControl size="small" sx={{ ml: "auto" }}>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="month">Theo Tháng</MenuItem>
                  <MenuItem value="day">Theo Ngày</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mt={2}>
              <Line data={filteredData} options={lineChartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, height: "100%", borderRadius: 5 }}>
            <Typography variant="h6" sx={{ color: "var(--text-color)" }}>
              Giới tính người dùng
            </Typography>

            <Box mt={3}>
              <Pie data={pieData} options={pieChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={8}>
          <Paper elevation={3} sx={{ p: 3, height: "100%", borderRadius: 5 }}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6" sx={{ color: "var(--text-color)" }}>
                Số lượng giao dịch
              </Typography>
              <FormControl size="small" sx={{ ml: "auto" }}>
                <Select
                  value={ticketTimeRange}
                  onChange={(e) => setTicketTimeRange(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="month">Theo Tháng</MenuItem>
                  <MenuItem value="day">Theo Ngày</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Bar data={barChartData} options={barChartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, height: "100%", borderRadius: 5 }}>
            <Typography variant="h6" sx={{ color: "var(--text-color)", mb: 2 }}>
              Tổng số liệu thanh toán
            </Typography>
            {transactions.map((transaction) => {
              const data = {
                labels: [
                  "Tổng tiền giao dịch đã huỷ",
                  "Tổng tiền giao dịch thành công",
                ],
                datasets: [
                  {
                    data: [transaction.totalRefunds, transaction.totalRevenue],
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.5)",
                      "rgba(75, 192, 192, 0.5)",
                    ],
                    hoverBackgroundColor: [
                      "rgba(255, 99, 132, 0.5)",
                      "rgba(75, 192, 192, 0.5)",
                    ],
                  },
                ],
              };

              return (
                <>
                  <Box
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "var(--text-color)" }}
                    >
                      Tổng tiền giao dịch:{" "}
                    </Typography>
                    <Typography variant="subtitle2">
                      {transaction.totalRefunds + transaction.totalRevenue} VNĐ
                    </Typography>
                  </Box>
                  <Doughnut key={transaction._id} data={data} />
                  <Divider sx={{ my: 1 }} />
                  <Box
                    justifyContent="space-between"
                    display="flex"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "var(--text-color)" }}
                    >
                      Lợi nhuận (10%)
                    </Typography>
                    <Typography variant="subtitle2">
                      {transaction.profit} VNĐ
                    </Typography>
                  </Box>
                </>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={1}>
        {/* Bảng xếp hạng top 5 người dùng */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 5 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" sx={{ color: "var(--text-color)" }}>
                {viewMode === "totalCost"
                  ? " Top người dùng có"
                  : " Top tài xế có"}{" "}
                {viewMode === "totalCost" ? "tổng chi tiêu" : "tổng thu nhập"}{" "}
                cao nhất
              </Typography>

              {/* Dropdown to switch between totalCost and totalIncome */}
              <FormControl sx={{ mt: 2, minWidth: 120 }}>
                <Select value={viewMode} onChange={handleViewModeChange}>
                  <MenuItem value="totalCost">Tổng chi tiêu</MenuItem>
                  <MenuItem value="totalIncome">Tổng thu nhập</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên người dùng</TableCell>
                    <TableCell align="">Số điện thoại</TableCell>
                    <TableCell align="center">
                      {viewMode === "totalCost"
                        ? "Tổng chi tiêu"
                        : "Tổng thu nhập"}
                    </TableCell>
                    <TableCell align="center">Thứ hạng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topUsers.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell align="">{user.phone}</TableCell>
                      <TableCell align="center">
                        {viewMode === "totalCost"
                          ? `${user.totalCost.toLocaleString()} VND`
                          : `${user.totalIncome.toLocaleString()} VND`}
                      </TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            backgroundColor:
                              index === 0
                                ? "#D9F1E8" // Vàng cho Top 1
                                : index === 1
                                ? "#EDE0FF" // Bạc cho Top 2
                                : index === 2
                                ? "#D6F4F9" // Đồng cho Top 3
                                : index === 3
                                ? "#FFF2DB" // Đồng cho Top 3
                                : "#FFE3DF",
                            padding: "4px 12px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "12px",
                            color:
                              index === 0
                                ? "#007867"
                                : index === 1
                                ? "#511AB8"
                                : index === 2
                                ? "#0E6C9C"
                                : index === 3
                                ? "#B76E00"
                                : "#B71D18",
                          }}
                        >
                          Top {index + 1}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminOverview;
