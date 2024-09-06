const express = require("express");
const router = express.Router();
const Message = require("../models/message"); // Import mô hình tin nhắn

// Endpoint để lấy tin nhắn giữa hai người dùng
router.get("/", async (req, res) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    return res
      .status(400)
      .json({ error: "senderId and receiverId are required" });
  }

  try {
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: 1 }); // Sắp xếp tin nhắn theo thời gian gửi

    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching messages" });
  }
});

module.exports = router;
