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
    image: {
      type: String, // Lưu đường dẫn hoặc tên hình ảnh
    },
  },

  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Bus = mongoose.model("Bus", busSchema);

module.exports = Bus;
