const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip", // Tham chiếu đến mô hình Trip
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến mô hình User
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến mô hình User
      required: true,
    },
    seatsPurchased: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"], // Trạng thái thanh toán
      default: "Pending",
    },
    purchaseTime: {
      type: Date,
      default: Date.now,
    },
    paymentTransactionId: {
      type: String,
    },
    state: {
      type: Number,
      default: 0, // Mặc định là 0
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
