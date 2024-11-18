const bcrypt = require("bcrypt");
const { User } = require("./models/user"); // Corrected the import here
const mongoose = require("mongoose");

module.exports = async () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.DB, connectionParams);
    console.log("Connected to database successfully");

    // Kiểm tra và tạo tài khoản admin mặc định
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash("admin123", salt);

      await new User({
        firstName: "Admin",
        lastName: "Admin",
        phone: "0000000000",
        sex: "other",
        birthDay: new Date("2002-10-23"),
        password: hashPassword,
        role: "admin",
      }).save();

      console.log("Default admin account created");
    }
  } catch (error) {
    console.log(error);
    console.log("Could not connect database!");
  }
};
