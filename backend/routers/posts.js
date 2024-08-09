const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const authenticateToken = require("../middleware/authenticateToken");

// Lấy danh sách các bài đăng (Không cần token)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("trip");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Thêm bài đăng mới (Yêu cầu token)
router.post("/", authenticateToken, async (req, res) => {
  const { postContent, image, trip } = req.body;

  try {
    const post = new Post({ postContent, image, trip });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Cập nhật thông tin bài đăng (Yêu cầu token)
router.put("/:id", authenticateToken, async (req, res) => {
  const { postContent, image, trip } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { postContent, image, trip },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Xóa bài đăng (Yêu cầu token)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
