// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    departureTime: {
      type: Date,
      required: true,
    },
    returnTime: {
      type: Date,
    },
    departurePoint: {
      type: String,
      required: true,
    },
    arrivalPoint: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
