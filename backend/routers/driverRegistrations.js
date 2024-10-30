const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const DriverRegistration = require("../models/driverRegistration");
const authenticateToken = require("../middleware/authenticateToken");
const Notification = require("../models/notification");
const { User } = require("../models/user");
const router = express.Router();

// Configure multer storage with dynamic folder creation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.body.userId;
    const userDir = `uploads/driverLicenses/${userId}`;

    // Check if directory exists, if not, create it
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir); // Set directory for the upload
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique filename with timestamp
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  const { status, userId } = req.query; // optional query parameters
  const filter = {}; // Initialize the filter object

  // Add filters based on provided query parameters
  if (status) {
    filter.status = status; // Filter by status if provided
  }
  if (userId) {
    filter.userId = userId; // Filter by userId if provided
  }

  try {
    const registrations = await DriverRegistration.find(filter);
    res.send(registrations);
  } catch (error) {
    res.status(500).send("Error fetching registrations");
  }
});

// Driver Registration Endpoint
router.post(
  "/",
  authenticateToken,
  upload.single("licenseImage"),
  async (req, res) => {
    try {
      const { userId, experience } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "License image is required." });
      }

      const newRegistration = new DriverRegistration({
        userId,
        licenseImage: `/${req.file.path}`, // Store the file path
        experience,
      });

      await newRegistration.save();
      res.status(201).json({
        message: "Registration submitted",
        registration: newRegistration,
      });
    } catch (error) {
      res.status(500).json({ message: "Error submitting registration", error });
    }
  }
);
// routes/driverRegistration.js
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // kỳ vọng 'approved' hoặc 'rejected'

  try {
    // Tìm và cập nhật trạng thái đăng ký
    const registration = await DriverRegistration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!registration) return res.status(404).send("Registration not found");

    // Nếu trạng thái là "approved", cập nhật vai trò người dùng thành "driver"
    if (status === "approved") {
      const user = await User.findById(registration.userId);
      if (!user) return res.status(404).send("User not found");

      user.role = "driver"; // Cập nhật vai trò người dùng
      await user.save(); // Lưu thay đổi vào database
      const notification = new Notification({
        actorId: user._id, // The user who receives the notification
        message: "Yêu cầu tài khoản tài xế của bạn đã được phê duyệt.",
        link: "",
      });

      await notification.save(); // Save the notification to the database
    }

    res.send(registration);
  } catch (error) {
    res.status(500).send("Error updating registration");
  }
});

module.exports = router;
