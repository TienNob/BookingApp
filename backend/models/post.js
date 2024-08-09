const mongoose = require("mongoose");

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
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
