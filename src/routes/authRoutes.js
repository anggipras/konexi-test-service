const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateProfile,
  updatePassword,
} = require("@/controllers/authController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for update profile
router.post("/update/profile", upload.single("profilePicture"), updateProfile);

// Route for update password
router.post("/update/password", updatePassword);

module.exports = router;
