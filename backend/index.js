require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routers/users");
const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const tripRoutes = require("./routers/trips");
const ticketRoutes = require("./routers/tickets");
const transactions = require("./routers/transactions");
const driverRegistrations = require("./routers/driverRegistrations");
const notificationRoutes = require("./routers/notification");
const payment = require("./services/payment");
const messageRoutes = require("./routers/messages");
const initSocket = require("./socket"); // Import file socket.js

const app = express();
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/transactions", transactions);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", payment);
app.use("/api/driver-registration", driverRegistrations);
app.use("/uploads", express.static("uploads"));

const server = http.createServer(app);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const io = initSocket(server);
