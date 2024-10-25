const express = require("express");
const Ticket = require("../models/ticket"); // Ensure the path is correct
const Trip = require("../models/trip"); // Ensure the path is correct
const Notification = require("../models/notification");
const { User } = require("../models/user");
const router = express.Router();
const Transaction = require("../models/transaction");
const { initiateRefund } = require("../services/refunPayment"); // Create this service for refund

// Get all tickets or tickets for a specific user, and remove tickets with deleted trips
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query params (if any)

    let tickets;
    if (userId) {
      // If userId is present, fetch tickets for that specific user
      tickets = await Ticket.find({ user: userId })
        .populate("trip")
        .populate("user");
    } else {
      // If no userId, fetch all tickets
      tickets = await Ticket.find().populate("trip").populate("user");
    }

    // Filter out tickets where the trip doesn't exist or has been deleted
    const validTickets = [];
    for (const ticket of tickets) {
      if (ticket.trip) {
        const tripExists = await Trip.exists({ _id: ticket.trip._id });
        if (tripExists) {
          validTickets.push(ticket); // Keep valid tickets
        } else {
          // Remove tickets where the trip has been deleted
          await Ticket.findByIdAndDelete(ticket._id);
        }
      } else {
        // Remove tickets where trip is null (already deleted)
        await Ticket.findByIdAndDelete(ticket._id);
      }
    }

    res.status(200).json(validTickets); // Return valid tickets
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets", error });
  }
});
router.delete("/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId).populate("user trip");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Find the associated trip
    const trip = await Trip.findById(ticket.trip._id).populate("user");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // // Step 1: Initiate refund process (this is just a placeholder function for now)
    // const refundResponse = await initiateRefund(
    //   ticket.paymentTransactionId,
    //   ticket.amountPaid
    // );

    // if (!refundResponse.success) {
    //   return res
    //     .status(500)
    //     .json({ message: "Refund failed", error: refundResponse.error });
    // }

    const refundAmount = ticket.amountPaid;

    trip.seatsAvailable += ticket.seatsPurchased;
    await trip.save();

    let transactionStats = await Transaction.findOne();

    if (!transactionStats) {
      transactionStats = new Transaction();
    }

    transactionStats.totalRevenue -= refundAmount; // Subtract refund from revenue
    transactionStats.totalRefunds += refundAmount; // Add refund to total refunds
    transactionStats.profit -= (refundAmount * 10) / 100; // Recalculate profit

    await transactionStats.save();

    // Step 3: Delete the ticket
    ticket.state = 1;
    await ticket.save();
    const user = await User.findById(ticket.user);
    const actor = await User.findById(ticket.actor);
    user.totalCost -= refundAmount;
    actor.totalIncome -= refundAmount;
    await user.save();
    await actor.save();

    // Step 4: Create a notification for the trip owner
    const ownerMessage = `${ticket.user.firstName} ${
      ticket.user.lastName
    } đã hủy vé trong chuyến đi ${trip.locations} vào ${new Date(
      trip.departureTime
    ).toLocaleString("vi-VN")}.`;

    const ownerNotification = new Notification({
      actorId: trip.user._id, // The owner of the trip (the person to be notified)
      message: ownerMessage,
      link: trip._id,
    });
    await ownerNotification.save();

    const userMessage = `Bạn đã hủy vé thành công trong chuyến đi ${
      trip.locations
    } vào ${new Date(trip.departureTime).toLocaleString("vi-VN")}. Số tiền ${
      ticket.amountPaid
    } đã được hoàn lại.`;

    const userNotification = new Notification({
      actorId: ticket.user._id, // Notify the user who canceled the ticket
      message: userMessage,
      link: trip._id,
    });
    await userNotification.save();

    res.status(200).json({
      message:
        "Ticket deleted successfully, refund processed, seats updated, notification sent.",
    });
  } catch (error) {
    console.error("Error deleting ticket and processing refund:", error);
    res
      .status(500)
      .json({ message: "Error processing refund or deleting ticket", error });
  }
});

module.exports = router;
