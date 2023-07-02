const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const User = require("@/models/User");
const config = require("@/config/config");
const { getUserById } = require("@/utils/GetUserById");

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an instance of the S3 service
const s3 = new AWS.S3();

// Function to register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, client_secret } = req.body;

    // Validate input fields (e.g., check for required fields, email format)

    // Check if the user exists and validate the client secret
    if (client_secret !== config.clientSecret) {
      return res.status(401).json({ message: "Invalid client secret" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed. Please try again later." });
  }
};

// Function to handle user login
const loginUser = async (req, res) => {
  try {
    const { email, password, client_secret } = req.body;

    // Validate input fields (e.g., check for required fields)

    // Check if the user exists and validate the client secret
    if (client_secret !== config.clientSecret) {
      return res.status(401).json({ message: "Invalid client secret" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Login failed. Please try again later.", error });
  }
};

// Function to update user profile
const updateProfile = async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch the authenticated user
    const user = await getUserById(req.headers.authorization);

    // Update profile in the user field
    user.email = email || user.email;

    // If a profile picture is uploaded, upload it to AWS S3
    if (req.file) {
      const fileContent = req.file.buffer;
      console.log("reqfile", req.file);

      // Set the parameters for S3 upload
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${user._id}/${req.file.originalname}`,
        Body: fileContent,
      };
      console.log("params", params);

      // // Upload the file to AWS S3
      // s3.upload(params, async (err, data) => {
      //   if (err) {
      //     console.error(err);
      //   } else {
      //     console.log(`File uploaded successfully. File URL: ${data.Location}`);
      //     // Save the file URL or perform other operations with the uploaded file

      //     // Get the URL of the uploaded file
      //     const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      //     console.log("imageUrl", imageUrl);

      //     // Save the image URL in the user's profile_picture field
      //     user.profile_picture = imageUrl;
      //     // Save the updated user profile
      //     await user.save();

      //     res.status(200).json({ message: "Profile updated successfully" });
      //   }
      // });
    } else {
      // Save the updated user profile
      await user.save();

      res.status(200).json({ message: "Profile updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error });
  }
};

// Function to update in the user field
const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await getUserById(req.headers.authorization);

    // Update the password in fields
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  updatePassword,
};
