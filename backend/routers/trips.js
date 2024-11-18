const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");
const Ticket = require("../models/ticket");
const { User } = require("../models/user");
const Notification = require("../models/notification");
const authenticateToken = require("../middleware/authenticateToken");

// Lấy danh sách các chuyến đi
// Lấy danh sách các chuyến đi với điều kiện cập nhật state
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().lean(); // Use lean() for faster queries with plain JS objects

    // Loop through each trip and update the state if necessary
    const updatedTrips = await Promise.all(
      trips.map(async (trip) => {
        // Check the condition
        if (new Date() > new Date(trip.departureTime) && trip.state === 0) {
          // Update the state to 1 if the condition is met
          await Trip.findByIdAndUpdate(trip._id, { state: 1 });
          trip.state = 1; // Update the state in the trip object
        }
        return trip; // Return the (possibly updated) trip object
      })
    );

    res.status(200).json(updatedTrips); // Send the updated trips
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find the trip and populate user and review fields
    const trip = await Trip.findById(req.params.id).populate("user").populate({
      path: "reviews.user",
      select: "firstName lastName avatar",
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Find tickets related to the trip and populate user fields
    const tickets = await Ticket.find({ trip: trip._id }).populate(
      "user",
      "firstName lastName"
    );

    // Convert the trip document to a plain JavaScript object to add custom fields
    const tripWithTickets = trip.toObject();

    // Add the tickets array with the desired structure
    tripWithTickets.tickets = tickets.map((ticket) => ({
      customerId: `${ticket.user._id}`,
    }));

    res.status(200).json(tripWithTickets);
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
    userId,
  } = req.body;

  try {
    // Find the trip
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Find all tickets for this trip
    const tickets = await Ticket.find({ trip: trip._id }).populate("user");

    // Update the trip details
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        seatsAvailable,
        totalSeats,
        locations,
        costPerKm,
        prices,
        departureTime,
        userId,
      },
      { new: true, runValidators: true }
    );

    // Notify each user who purchased a ticket about the trip update
    await Promise.all(
      tickets.map(async (ticket) => {
        const user = ticket.user;
        const message = `Chuyến đi ${locations} vào ${new Date(
          departureTime
        ).toLocaleString("vi-VN")} đã được cập nhật.`;

        const notification = new Notification({
          actorId: user._id, // Notify the user who purchased the ticket
          message: message,
          link: trip._id,
        });

        await notification.save();
      })
    );

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Error updating trip", error });
  }
});

module.exports = router;

// Xóa chuyến đi
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.id;

    // Find the trip to be deleted
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Find all tickets for this trip
    const tickets = await Ticket.find({ trip: tripId }).populate("user");

    // Notify each user who has purchased a ticket for this trip
    for (const ticket of tickets) {
      const user = ticket.user;
      const message = `Chuyến đi ${trip.locations} vào ${new Date(
        trip.departureTime
      ).toLocaleString("vi-VN")} đã bị hủy.`;

      // Create and save the notification
      const notification = new Notification({
        actorId: user._id, // Notify the user who purchased the ticket
        message: message,
        link: trip._id,
      });
      await notification.save();

      // Update the ticket state to '1' (canceled)
      ticket.state = 1;
      await ticket.save();

      // Update the user's total cost
      user.totalCost -= ticket.amountPaid;
      await user.save(); // Sequential save to avoid ParallelSaveError

      // Update the actor's total income (the person who posted the trip)
      const actor = await User.findById(trip.user);
      if (actor) {
        actor.totalIncome -= ticket.amountPaid;
        await actor.save(); // Sequential save
      }
    }

    // Finally, delete the trip
    await Trip.findByIdAndDelete(tripId);

    res.status(200).json({
      message: "Trip deleted, tickets marked as canceled, notifications sent.",
    });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Error deleting trip", error });
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
            state: ticket.state,
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
// Cập nhật trạng thái của chuyến đi
router.patch("/:id/state", authenticateToken, async (req, res) => {
  const { state } = req.body; // Lấy trạng thái mới từ request body

  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if the state value is valid
    if (state < 2 || state > 7) {
      return res.status(400).json({ message: "Invalid state value" });
    }

    // Update the trip state
    trip.state = state;

    await trip.save();

    res.status(200).json({ message: "Trip state updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip state:", error);
    res.status(500).json({ message: "Error updating trip state", error });
  }
});

// Add a review to a trip

router.post("/:id/reviews", authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    // Find the trip and its owner
    const trip = await Trip.findById(req.params.id).populate("user");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Find the current user's details
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new review
    const review = {
      user: req.user._id,
      rating,
      comment,
    };
    trip.reviews.push(review);

    await trip.save();

    // Create a notification for the trip owner
    const notification = new Notification({
      actorId: trip.user._id,
      message: `${currentUser.firstName} ${currentUser.lastName} đã để lại một đánh giá mới cho chuyến đi của bạn.`,
      link: trip._id,
    });

    await notification.save();

    // Send back the review data in the response
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error });
  }
});
router.get("/:userId/reviews", async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm tất cả các chuyến đi của người dùng
    const trips = await Trip.find({ user: userId }).select("reviews").populate({
      path: "reviews.user",
      select: "firstName lastName avatar",
    });

    // Tạo mảng chứa tất cả các đánh giá từ các chuyến đi của user
    const reviews = trips.flatMap((trip) => trip.reviews);

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for user:", error);
    res.status(500).json({ message: "Failed to load user reviews", error });
  }
});
module.exports = router;
