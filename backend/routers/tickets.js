// routers/tickets.js
const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Bus = require("../models/Bus");

// Lấy danh sách vé xe bus
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("bus");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Thêm vé xe bus mới
router.post("/", async (req, res) => {
  const {
    departureTime,
    returnTime,
    departurePoint,
    arrivalPoint,
    price,
    bus,
  } = req.body;

  try {
    // Kiểm tra xem xe bus có tồn tại không
    const busExists = await Bus.findById(bus);
    if (!busExists) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const ticket = new Ticket({
      departureTime,
      returnTime,
      departurePoint,
      arrivalPoint,
      price,
      bus,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Cập nhật thông tin vé xe bus
router.put("/:id", async (req, res) => {
  const {
    departureTime,
    returnTime,
    departurePoint,
    arrivalPoint,
    price,
    bus,
  } = req.body;

  try {
    // Kiểm tra xem xe bus có tồn tại không
    if (bus) {
      const busExists = await Bus.findById(bus);
      if (!busExists) {
        return res.status(404).json({ message: "Bus not found" });
      }
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { departureTime, returnTime, departurePoint, arrivalPoint, price, bus },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Xóa vé xe bus
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
