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
    state: {
      type: Number,
      default: 0, // Mặc định là 0
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, min: 1, max: 5 }, // Rating from 1 to 5
        comment: { type: String }, // User review
        createdAt: { type: Date, default: Date.now }, // Timestamp of the review
      },
    ],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);
tripSchema.pre("save", function (next) {
  const now = new Date();

  // Chỉ tự động thay đổi state nếu nó đang ở trạng thái 0
  if (this.state === 0) {
    if (this.departureTime < now) {
      this.state = 1; // Mark as inactive if the departure time has passed
    } else {
      this.state = 0; // Mark as active if the departure time is still in the future
    }
  }

  next();
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
