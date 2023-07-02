const jwt = require("jsonwebtoken");
const User = require("@/models/User");

const getUserById = async (authHeader) => {
  const token = authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return await User.findById(decodedToken.userId);
};

module.exports = { getUserById };
