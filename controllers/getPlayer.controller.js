const Player = require("../models/Player");

const getPlayer = async (req, res) => {
  const player = await Player.findOne({
    userId: req.user.id,
  });

  if (!player) {
    console.log(req.user)
    return res.status(404).json({
      message: "Player not found",
    });
  }

  return res.json(player);
};

module.exports = getPlayer;
