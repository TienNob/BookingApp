const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).send({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
};

module.exports = authenticateToken;
