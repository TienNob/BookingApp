const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    seatsAvailable: {
      type: Number,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    locations: [
      {
        type: String,
        required: true,
      },
    ],
    costPerKm: {
      type: Number,
      required: true,
    },
    prices: [
      {
        type: Number,
        required: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến mô hình User
      required: true, // Bắt buộc phải có người đăng
    },
    departureTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
