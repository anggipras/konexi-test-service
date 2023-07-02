const Post = require("@/models/Post");
const User = require("@/models/User");
const { getUserById } = require("@/utils/GetUserById");

// Function to create a new post
const createPost = async (req, res) => {
  try {
    // Retrieve post data from the request body
    const { content } = req.body;
    const user = await getUserById(req.headers.authorization);

    // Create a new post using the retrieved data
    const post = await Post.create({
      content,
      userId: user._id,
    });

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};

// Function to update an existing post
const updatePost = async (req, res) => {
  try {
    // Retrieve post data from the request body
    const { content } = req.body;
    const { postId } = req.params;

    // Find the post by ID and update its title and content
    const post = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
};

// Function to delete a post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID and delete it
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const user = await getUserById(req.headers.authorization);

    // Find all posts created by the specified user
    const posts = await Post.find({ userId: user._id });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user posts", error });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Find posts that contain the keyword in the content field
    const posts = await Post.find({
      content: { $regex: keyword, $options: "i" },
    });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to search posts", error });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    // Find the post by its ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    // Add the user's ID to the likes array
    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to like the post", error });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    // Find the post by its ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already unliked the post
    if (!post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already unliked this post" });
    }

    // Remove the user's ID from the likes array
    post.likes.pull(userId);
    await post.save();

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unlike the post" });
  }
};

// Comment on a post
const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;
    const userId = req.user._id;

    // Find the post by its ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment object
    const newComment = {
      userId,
      comment,
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);
    await post.save();

    res
      .status(200)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

const getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const following = currentUser.following; // Get the list of users being followed

    // Find the posts of the current user and the users being followed
    const posts = await Post.find({
      $or: [{ userId: { $in: following } }, { userId: currentUser._id }],
    }).sort({ createdAt: -1 });

    // Combine the posts and comments data
    const feed = posts.map((post) => ({
      post,
    }));

    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feed" });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  searchPosts,
  likePost,
  unlikePost,
  commentOnPost,
  getFeed,
};
