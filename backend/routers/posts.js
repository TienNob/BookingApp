const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const authenticateToken = require("../middleware/authenticateToken");

// Lấy danh sách các bài đăng (Không cần token)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("trip")
      .populate("actor", "firstName lastName phone")
      .populate("comments.user", "firstName lastName");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Thêm bài đăng mới (Yêu cầu token)
router.post("/", authenticateToken, async (req, res) => {
  const { postContent, image, trip } = req.body;

  try {
    const actor = req.user._id;

    const post = new Post({ postContent, image, trip, actor });
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
router.post("/:id/comments", authenticateToken, async (req, res) => {
  const { text } = req.body;
  const userId = req.user._id;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: userId, text });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});
// Thả tim hoặc bỏ thả tim bài đăng (Yêu cầu token)
router.post("/:id/hearts", authenticateToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    const hearted = post.hearts.includes(userId);

    if (hearted) {
      // Nếu đã thả tim, bỏ thả tim
      post.hearts.pull(userId);
    } else {
      // Nếu chưa thả tim, thêm thả tim
      post.hearts.push(userId);
    }

    await post.save();

    res.status(200).json({ post, hearted: !hearted });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
