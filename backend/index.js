require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routers/users");
const authRoutes = require("./routers/auth");
const postRoutes = require("./routers/posts");
const tripRoutes = require("./routers/trips");

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
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
