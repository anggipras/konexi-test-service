const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
