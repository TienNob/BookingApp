const express = require("express");
const router = express.Router();
const Notification = require("../models/notification"); // Import mô hình thông báo

// Route lấy danh sách thông báo của một actor
router.get("/", async (req, res) => {
  try {
    // Lấy actorId từ tham số truy vấn
    const { actorId } = req.query;

    // Kiểm tra nếu không có actorId
    if (!actorId) {
      return res
        .status(400)
        .json({ message: "actorId query parameter is required" });
    }

    // Tìm thông báo theo actorId và sắp xếp theo thời gian giảm dần
    const notifications = await Notification.find({ actorId }).sort({
      createdAt: -1,
    });

    // Trả về danh sách thông báo
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
});
router.get("/unread-count", async (req, res) => {
  try {
    const { actorId } = req.query;
    if (!actorId) {
      return res.status(400).json({ message: "actorId is required" });
    }

    const unreadCount = await Notification.countDocuments({
      actorId,
      isRead: false,
    });
    res.status(200).json({ count: unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread count", error });
  }
});
router.patch("/read", async (req, res) => {
  try {
    const { actorId } = req.body;

    if (!actorId) {
      return res.status(400).json({ message: "actorId is required" });
    }

    // Cập nhật tất cả thông báo của actorId thành đã đọc
    await Notification.updateMany({ actorId }, { $set: { isRead: true } });

    res.status(200).json({ message: "Notifications updated to read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications", error });
  }
});

module.exports = router;
