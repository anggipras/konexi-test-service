require("./alias");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("@/routes/authRoutes");
const postRoutes = require("@/routes/postRoutes");
const userRoutes = require("@/routes/userRoutes");
const { authenticateUser } = require("@/middleware/authMiddleware");

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Konexi Test Backend");
});

// Apply authentication middleware to all routes except for registration / login
app.use((req, res, next) => {
  if (
    req.originalUrl === "/auth/login" ||
    req.originalUrl === "/auth/register"
  ) {
    next();
  } else {
    authenticateUser(req, res, next);
  }
});

// Routes for user authentication
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
