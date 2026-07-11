const Player = require("../models/Player");

const getPlayer = async (req, res) => {
  const player = await Player.findOne({
    userId: req.user.discordId,
  });

  if (!player) {
    player = await Player.create({
      userId: req.user.discordId,
      username: req.user.username,
      avatar: req.user.avatar
    });
  }

  return res.json(player);
};

module.exports = getPlayer;
