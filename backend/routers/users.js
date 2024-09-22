const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const avatarUploadDir = "uploads/profileImg/avatar";
const coverUploadDir = "uploads/profileImg/cover";
if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}
if (!fs.existsSync(coverUploadDir)) {
  fs.mkdirSync(coverUploadDir, { recursive: true });
}

// Configure multer storage for avatar and cover photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath =
      file.fieldname === "avatar" ? avatarUploadDir : coverUploadDir;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as file name to avoid conflicts
  },
});
const upload = multer({ storage: storage });

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ phone: req.body.phone });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select(
      "firstName lastName phone friends avatar followers"
    );
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) return res.status(404).send({ message: "User not found" });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, cccd, phone } = req.body;

    // Kiểm tra nếu thông tin không hợp lệ
    if (!firstName || !lastName || !cccd || !phone) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });

    // Cập nhật các thông tin người dùng
    user.firstName = firstName;
    user.lastName = lastName;
    user.cccd = cccd; // Assuming `cccd` is a field in your User model
    user.phone = phone; // Update phone number (assuming the field is `phone`)

    // Lưu thông tin người dùng đã cập nhật
    await user.save();

    res
      .status(200)
      .send({ message: "User information updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post(
  "/:id/upload",
  authenticateToken,
  upload.fields([{ name: "avatar" }, { name: "coverPhoto" }]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send({ message: "User not found" });

      if (req.files.avatar) {
        user.avatar = `/${avatarUploadDir}/${req.files.avatar[0].filename}`;
      }
      if (req.files.coverPhoto) {
        user.coverPhoto = `/${coverUploadDir}/${req.files.coverPhoto[0].filename}`;
      }

      await user.save();
      res
        .status(200)
        .send({ message: "Profile images uploaded successfully", user });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

// Delete cover photo
router.delete("/:id/coverPhoto", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });

    if (user.coverPhoto && fs.existsSync(`.${user.coverPhoto}`)) {
      fs.unlinkSync(`.${user.coverPhoto}`);
      user.coverPhoto = null;
    }

    await user.save();
    res.status(200).send({ message: "Cover photo deleted successfully", user });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/:id/friends", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.body.friendId);

    if (!user || !friend)
      return res.status(404).send({ message: "User or friend not found" });

    if (user.friends.includes(req.body.friendId))
      return res.status(400).send({ message: "Friend already added" });

    user.friends.push(req.body.friendId);
    friend.followers.push(req.params.id); // Add the user as a follower to the friend

    await user.save();
    await friend.save();

    res
      .status(200)
      .send({ message: "Friend added successfully", friends: user.friends });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:id/friends", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "friends",
      "firstName lastName avatar"
    );

    if (!user) return res.status(404).send({ message: "User not found" });

    res.status(200).send({ friends: user.friends });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.delete("/:id/friends/:friendId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.params.friendId);

    if (!user || !friend)
      return res.status(404).send({ message: "User not found" });

    const friendIndex = user.friends.indexOf(req.params.friendId);
    const followerIndex = friend.followers.indexOf(req.params.id);

    if (friendIndex === -1 || followerIndex === -1)
      return res.status(400).send({ message: "Friend not found in the list" });

    user.friends.splice(friendIndex, 1);
    friend.followers.splice(followerIndex, 1);

    await user.save();
    await friend.save();

    res
      .status(200)
      .send({ message: "Friend removed successfully", friends: user.friends });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.get("/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "firstName lastName avatar") // Populate followers with specific fields
      .select("followers"); // Only select the followers field

    if (!user) return res.status(404).send({ message: "User not found" });

    res.status(200).send({ followers: user.followers });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
