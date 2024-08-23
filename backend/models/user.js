const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Friends list
  avatar: { type: String }, // Path to the avatar image file
  coverPhoto: { type: String }, // Path to the cover photo file
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Followers list
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

// New method to count followers
userSchema.methods.getFollowersCount = function () {
  return this.followers.length;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    phone: Joi.string()
      .pattern(new RegExp("^[0-9]{10,15}$"))
      .required()
      .label("Phone"), // Updated validation
    password: passwordComplexity().required().label("Password"),
    avatar: Joi.any().optional().label("Avatar"), // Optional, file upload
    coverPhoto: Joi.any().optional().label("Cover Photo"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
