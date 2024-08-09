const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const authenticateToken = require("../middleware/authenticateToken");

// Lấy danh sách các chuyến đi
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Thêm chuyến đi mới
router.post("/", authenticateToken, async (req, res) => {
  const { seatsAvailable, locations, prices } = req.body;

  try {
    const trip = new Trip({ seatsAvailable, locations, prices });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Cập nhật thông tin chuyến đi
router.put("/:id", authenticateToken, async (req, res) => {
  const { seatsAvailable, locations, prices } = req.body;

  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { seatsAvailable, locations, prices },
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status500.json({ message: "Server Error", error });
  }
});

// Xóa chuyến đi
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
