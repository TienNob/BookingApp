const jwt = require("jsonwebtoken");

// Middleware to authenticate socket connections
const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query.token;

  if (token) {
    jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = decoded; // Attach user info to socket
      next();
    });
  } else {
    next(new Error("No token provided"));
  }
};

module.exports = authenticateSocket;
