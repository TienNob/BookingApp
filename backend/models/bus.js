const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    amenities: [String], // Mảng chứa các tiện nghi
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
