const jwt = require("jsonwebtoken");
const User = require("@/models/User");

// Middleware to verify JWT token and authenticate user
async function authenticateUser(req, res, next) {
  const headerAuth = req.headers.authorization;
  let token;
  if (headerAuth) {
    token = headerAuth.split(" ")[1];
    try {
      // Get and Verify the JWT token the request headers
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Get the user from the decoded token
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Set the authenticated user information on the request object
      req.user = user;

      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: "Authentication failed. Invalid token." });
    }
  } else {
    res
      .status(401)
      .json({ message: "Authentication failed. No token provided." });
  }
}

module.exports = {
  authenticateUser,
};
