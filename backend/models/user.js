const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    cccd: { type: String },
    sex: { type: String, required: true },
    birthDay: { type: Date, required: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Friends list
    avatar: { type: String }, // Path to the avatar image file
    coverPhoto: { type: String }, // Path to the cover photo file
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Followers list
    role: { type: String, enum: ["admin", "user"], default: "user" }, // New role field
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

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
    birthDay: Joi.date().required().label("BirthDay"), // Validate ngày sinh
    sex: Joi.string().required().label("Sex"), // Validate giới tín
    avatar: Joi.any().optional().label("Avatar"), // Optional, file upload
    coverPhoto: Joi.any().optional().label("Cover Photo"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
