const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    postContent: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Lưu đường dẫn hình ảnh (URL)
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến mô hình User
      required: true, // Bắt buộc phải có người đăng
    },
    comments: [commentSchema], // Thêm trường comments
    hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
