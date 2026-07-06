const jwt = require("jsonwebtoken");

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