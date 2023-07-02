const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  searchPosts,
  likePost,
  unlikePost,
  commentOnPost,
  getFeed,
} = require("@/controllers/postController");

// Route for creating a new post
router.post("/create", createPost);

// Route for updating an existing post
router.post("/update/:postId", updatePost);

// Route for deleting a post
router.delete("/delete/:postId", deletePost);

// Route for getting a user's posts
router.get("/list-posts", getUserPosts);

// Route for searching posts by keyword
router.get("/search", searchPosts);

// Route Like a post
router.post("/like/:postId", likePost);

// Route Unlike a post
router.post("/unlike/:postId", unlikePost);

// Route Comment on a post
router.post("/comment/:postId", commentOnPost);

// Route for get list of feed
router.get("/feed", getFeed);

module.exports = router;
