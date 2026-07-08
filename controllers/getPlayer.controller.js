const Player = require("../models/Player");

const getPlayer = async (req, res) => {
  const player = await Player.findOne({
    userId: req.user.discordId,
  });

  if (!player) {
    return res.status(404).json({
      message: "Player not found",
    });
  }

  return res.json(player);
};

module.exports = getPlayer;
