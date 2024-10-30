const axios = require("axios").default; // npm install axios
const crypto = require("crypto"); // Thay thế crypto-js bằng module crypto
const express = require("express"); // npm install express
const moment = require("moment"); // npm install moment
const qs = require("qs");
const Ticket = require("../models/ticket");
const Trip = require("../models/trip");
const { User } = require("../models/user");
const Notification = require("../models/notification");
const TransactionStats = require("../models/transaction");

const router = express.Router();
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

// Route tạo thanh toán ZaloPay
router.post("/", async (req, res) => {
  try {
    const {
      amount,
      description,
      tripId,
      location,
      userId,
      actorId,
      seatsPurchased,
      departureTime,
    } = req.body;
    console.log(req.body);
    const embed_data = {
      redirecturl: "http://localhost:5173/my-tickets",
      tripId: tripId,
      location: location,
      userId: userId,
      actorId: actorId,
      seatsPurchased: seatsPurchased,
      departureTime: departureTime,
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      callback_url:
        "https://d278-103-156-2-76.ngrok-free.app/api/payment/callback",
      description: description || `Payment for order #${transID}`,
      bank_code: "",
    };

    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;

    // Tạo HMAC SHA256 bằng crypto thay vì crypto-js
    order.mac = crypto
      .createHmac("sha256", config.key1)
      .update(data)
      .digest("hex");

    const result = await axios.post(config.endpoint, null, { params: order });
    return res.status(200).json({
      ...result.data, // Spread operator để bao gồm toàn bộ dữ liệu từ result.data
      app_trans_id: order.app_trans_id, // Thêm mã giao dịch vào phản hồi
    });
  } catch (error) {
    console.error("Error creating payment: ", error);
    return res.status(500).json({ message: "Error creating payment", error });
  }
});

// Route callback khi thanh toán thành công
router.post("/callback", async (req, res) => {
  let result = {};
  try {
    console.log("Callback request body:", req.body);
    // Kiểm tra xem req.body có chứa data và mac không
    if (!req.body.data || !req.body.mac) {
      throw new Error("Missing data or mac in request body");
    }

    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Kiểm tra kiểu dữ liệu của dataStr
    if (typeof dataStr !== "string") {
      throw new Error("Data must be a string");
    }

    // Tạo HMAC SHA256 để kiểm tra tính hợp lệ
    const mac = crypto
      .createHmac("sha256", config.key2)
      .update(dataStr)
      .digest("hex");

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      const dataJson = JSON.parse(dataStr);
      console.log(dataJson);
      console.log(
        "Payment success for app_trans_id:",
        dataJson["app_trans_id"]
      );

      // Lấy embed_data từ ZaloPay để lấy tripId, userId, seatsPurchased
      const embedData = JSON.parse(dataJson.embed_data);
      const {
        tripId,
        userId,
        actorId,
        seatsPurchased,
        location,
        departureTime,
      } = embedData;
      const amountPaid = dataJson.amount;

      // Truy vấn thông tin người dùng dựa trên userId
      const user = await User.findById(userId); // Giả sử bạn đã có model User
      const actor = await User.findById(actorId); // Giả sử bạn đã có model User
      if (!user) {
        throw new Error("User not found");
      }

      const firstName = user.firstName;
      const lastName = user.lastName;
      user.totalCost += amountPaid;
      actor.totalIncome += amountPaid;

      await user.save();
      await actor.save();
      // Update trip seat availability
      const trip = await Trip.findById(tripId);
      if (!trip || trip.seatsAvailable < seatsPurchased) {
        throw new Error("Invalid trip or not enough seats available");
      }

      trip.seatsAvailable -= seatsPurchased;
      if (trip.seatsAvailable === 0) {
        trip.state = 1;
      }
      await trip.save();
      // Create and save the ticket
      const newTicket = new Ticket({
        trip: tripId,
        location: location,
        user: userId,
        actor: actorId,
        departureTime: departureTime,
        seatsPurchased,
        amountPaid,
        paymentStatus: "Paid", // Đánh dấu đã thanh toán
        paymentTransactionId: dataJson.zp_trans_id,
      });
      await newTicket.save();

      // Find or create the transaction statistics
      let stats = await TransactionStats.findOne();
      if (!stats) {
        stats = new TransactionStats();
      }

      // Update stats
      stats.totalRevenue += amountPaid;
      stats.profit = (stats.totalRevenue * 10) / 100;

      // Save updated stats
      await stats.save();

      const newNotification = new Notification({
        actorId: actorId,
        message: `${firstName} ${lastName} đã mua vé ${location}. Số ghế: ${seatsPurchased}, Tổng tiền: ${amountPaid} VND`,
        link: tripId,
      });
      await newNotification.save();

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (error) {
    console.error("Error processing callback: ", error.message);
    result.return_code = 0;
    result.return_message = error.message;
  }

  res.json(result);
});

// Route kiểm tra trạng thái thanh toán
router.post("/check-status", async (req, res) => {
  try {
    const { app_trans_id } = req.body;

    if (!app_trans_id) {
      return res.status(400).json({ message: "app_trans_id is required" });
    }

    const postData = {
      app_id: config.app_id,
      app_trans_id,
    };

    const data =
      postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
    postData.mac = crypto
      .createHmac("sha256", config.key1)
      .update(data)
      .digest("hex");

    const postConfig = {
      method: "post",
      url: "https://sb-openapi.zalopay.vn/v2/query",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };

    const result = await axios(postConfig);
    return res.status(200).json(result.data);
  } catch (error) {
    console.error("Error checking order status: ", error);
    return res
      .status(500)
      .json({ message: "Error checking order status", error });
  }
});

module.exports = router;
