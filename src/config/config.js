require("dotenv").config();

const config = {
  jwtSecret: process.env.JWT_SECRET,
  mongoURI: process.env.MONGODB_URI,
  port: process.env.PORT,
  clientSecret: process.env.CLIENT_SECRET,
};

module.exports = config;
