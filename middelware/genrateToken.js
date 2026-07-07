const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      discordId: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};