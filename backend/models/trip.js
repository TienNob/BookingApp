const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    seatsAvailable: {
      type: Number,
      required: true,
    },
    locations: [
      {
        type: String,
        required: true,
      },
    ],
    prices: [
      {
        type: Number,
        required: true,
      },
    ],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
