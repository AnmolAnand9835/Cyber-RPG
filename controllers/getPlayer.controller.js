const Player = require("../models/Player");

const getPlayer = async (req, res) => {
  const player = await Player.findOne({
    userId: req.user.discordId,
  });

  if (!player) {
    const newPlayer = await Player.create({
      userId: req.user.discordId,
      username: req.user.username,
      avatar: req.user.avatar
        ? `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}.png?size=512`
        : `https://cdn.discordapp.com/embed/avatars/${Number(req.user.discordId) % 5}.png`,
    });

    return res.json(newPlayer);
  }

  return res.json(player);
};

module.exports = getPlayer;
