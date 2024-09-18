const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const Ticket = require("../models/ticket");
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
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("user"); // Lấy thông tin chi tiết của user

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Thêm chuyến đi mới
router.post("/", authenticateToken, async (req, res) => {
  const {
    seatsAvailable,
    totalSeats,
    locations,
    costPerKm,
    prices,
    departureTime,
  } = req.body;

  try {
    const user = req.user._id; // Lấy user từ token

    const trip = new Trip({
      seatsAvailable,
      totalSeats,
      locations,
      costPerKm,
      prices,
      departureTime,
      user,
    });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Cập nhật thông tin chuyến đi
router.put("/:id", authenticateToken, async (req, res) => {
  const {
    seatsAvailable,
    totalSeats,
    locations,
    costPerKm,
    prices,
    departureTime,
  } = req.body;

  try {
    const user = req.user._id; // Lấy user từ token

    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        seatsAvailable,
        totalSeats,
        locations,
        costPerKm,
        prices,
        departureTime,
        user,
      },
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

router.get("/my-trips/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all trips for this user
    const trips = await Trip.find({ user: userId }).lean(); // Use lean() to get plain JavaScript objects

    // For each trip, find who purchased tickets
    const tripsWithTickets = await Promise.all(
      trips.map(async (trip) => {
        if (new Date() > new Date(trip.departureTime) && trip.state === 0) {
          await Trip.findByIdAndUpdate(trip._id, { state: 1 }); // Cập nhật state thành 1
          trip.state = 1;
        }
        const tickets = await Ticket.find({ trip: trip._id }).populate(
          "user",
          "firstName lastName"
        ); // Include user's name
        return {
          ...trip,
          tickets: tickets.map((ticket) => ({
            seatsPurchased: ticket.seatsPurchased,
            amountPaid: ticket.amountPaid,
            location: ticket.location,
            purchaseTime: ticket.purchaseTime,
            user: `${ticket.user.firstName} ${ticket.user.lastName}`,
          })),
        };
      })
    );

    res.status(200).json(tripsWithTickets);
  } catch (error) {
    console.error("Error fetching trips or tickets:", error);
    res.status(500).json({ message: "Failed to load trips and tickets" });
  }
});
module.exports = router;
