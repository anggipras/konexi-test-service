const User = require("@/models/User");

// Follow a user
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = req.user; // Assuming the authenticated user is available in req.user

    // Check if the user is already following the target user
    if (currentUser.following.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Add the target user to the following list of the current user
    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    userToFollow.following.push(currentUser._id);
    await userToFollow.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to follow user", error });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = req.user; // Assuming the authenticated user is available in req.user

    // Check if the user is already not following the target user
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res
        .status(400)
        .json({ message: "You Fare not following this user" });
    }

    // Remove the target user from the following list of the current user
    currentUser.following.pull(userToUnfollow._id);
    await currentUser.save();

    userToUnfollow.following.pull(currentUser._id);
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unfollow user", error });
  }
};

module.exports = { followUser, unfollowUser };
