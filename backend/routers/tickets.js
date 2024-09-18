const express = require("express");
const Ticket = require("../models/ticket"); // Đảm bảo đường dẫn đúng
const router = express.Router();

// Lấy tất cả các vé hoặc vé của người dùng cụ thể
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query; // Lấy userId từ query params (nếu có)

    let tickets;
    if (userId) {
      // Nếu có userId thì chỉ lấy vé của người dùng đó
      tickets = await Ticket.find({ user: userId })
        .populate("trip")
        .populate("user");
    } else {
      // Nếu không có userId thì lấy tất cả các vé
      tickets = await Ticket.find().populate("trip").populate("user");
    }

    res.status(200).json(tickets); // Trả về danh sách vé
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets", error });
  }
});

module.exports = router;
