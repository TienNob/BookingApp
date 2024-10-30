const mongoose = require("mongoose");

const driverRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  licenseImage: { type: String, required: true }, // URL/path to the uploaded license image
  experience: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DriverRegistration", driverRegistrationSchema);
