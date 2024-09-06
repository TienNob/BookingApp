const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file với timestamp để tránh trùng lặp
  },
});

// Khởi tạo Multer với cấu hình lưu trữ
const upload = multer({ storage: storage });

// Lấy danh sách các bài đăng (Không cần token)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("trip")
      .populate("actor", "firstName lastName phone avatar")
      .populate("comments.user", "firstName lastName avatar");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/actor/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const posts = await Post.find({ actor: _id })
      .populate("trip")
      .populate("actor", "firstName lastName phone avatar")
      .populate("comments.user", "firstName lastName avatar");

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this actor" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
// Lấy danh sách hình ảnh theo userId
router.get("/images/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ actor: userId }).select("image"); // Chỉ lấy trường image

    // Lọc ra những post có image không null
    const images = posts.filter((post) => post.image).map((post) => post.image);

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Thêm bài đăng mới (Yêu cầu token)
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { postContent, trip } = req.body;

    try {
      const actor = req.user._id;

      // Construct the image path
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      const post = new Post({ postContent, image: imagePath, trip, actor });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

// Cập nhật thông tin bài đăng (Yêu cầu token)
router.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const { postContent, trip } = req.body;

    try {
      // Find the post by ID
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Update the post content and trip
      post.postContent = postContent;
      post.trip = trip;

      // If a new image was uploaded, update the image path
      if (req.file) {
        post.image = `/uploads/${req.file.filename}`;
      }

      await post.save();
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  }
);

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
