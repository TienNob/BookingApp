const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
// Route để điều hướng người dùng đến Zalo
const admin = require("../firebase/config");
router.post("/facebook-login", async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUserId = decodedToken.uid;

    // Check if the user exists in your database
    let user = await User.findOne({ firebaseUserId });
    if (!user) {
      user = new User({
        firstName: decodedToken.name.split(" ")[0], // Giả sử là First Name
        lastName: decodedToken.name.split(" ")[1],
        avatar: decodedToken.picture,
        phone: "",
        password: "",
        sex: "",
        birthDay: new Date(),
        firebaseUserId: decodedToken.uid,
      });
      await user.save();
    }

    // Create a JWT for your application's session management
    const appToken = jwt.sign({ _id: user }, process.env.JWTPRIVATEKEY);
    res.status(200).send({ data: { user, token: appToken } });
  } catch (error) {
    console.error("Error in Facebook login:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ phone: req.body.phone });
    if (!user)
      return res.status(401).send({ message: "Invalid Phone or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Phone or Password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY);

    const { password, ...userWithoutPassword } = user._doc;
    res.status(200).send({
      data: { ...userWithoutPassword, token },
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    phone: Joi.string()
      .pattern(new RegExp("^[0-9]{10,15}$"))
      .required()
      .label("Phone"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
