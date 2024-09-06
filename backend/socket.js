const jwt = require("jsonwebtoken");
const Message = require("./models/message"); // Import mô hình tin nhắn

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query.token;
  if (token) {
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = decoded; // Gắn thông tin người dùng vào socket
      next();
    });
  } else {
    next(new Error("No token provided"));
  }
};

const initSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`User ${socket.user._id} connected`);
    socket.join(socket.user._id);

    socket.on("chatMessage", async ({ text, receiverId }) => {
      const message = new Message({
        senderId: socket.user._id,
        receiverId,
        text,
      });

      await message.save(); // Lưu tin nhắn vào database

      // Gửi tin nhắn đến người nhận
      io.to(receiverId).emit("chatMessage", {
        receiverId: socket.user._id,
        text: message.text,
        timestamp: message.timestamp,
      });
      // Phát sự kiện "newMessage" để thông báo có tin nhắn mới
      io.to(receiverId).emit("newMessage", {
        senderId: socket.user._id,
        text: message.text,
        timestamp: message.timestamp,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.user._id} disconnected`);
    });
  });

  return io;
};

module.exports = initSocket;
