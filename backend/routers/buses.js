const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus");

// Lấy danh sách xe bus
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Thêm xe bus mới
router.post("/", async (req, res) => {
  const { name, seats, amenities } = req.body;

  try {
    const bus = new Bus({ name, seats, amenities });
    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Cập nhật thông tin xe bus
router.put("/:id", async (req, res) => {
  const { name, seats, amenities } = req.body;

  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { name, seats, amenities },
      { new: true, runValidators: true }
    );

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Xóa xe bus
router.delete("/:id", async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
