const express = require("express");
const router = express.Router();
const { followUser, unfollowUser } = require("@/controllers/userController");

router.post("/follow/:userId", followUser);
router.post("/unfollow/:userId", unfollowUser);

module.exports = router;
