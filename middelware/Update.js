const Player = require("../models/Player");

module.exports = async (message) => {
  const username = message.author.username;
  const avatar = message.author.displayAvatarURL({
    extension: "png",
    size: 512,
  });

  const player = await Player.findOne({
    userId: message.author.id,
  });

  if (!player) return `Please just use (sudo start) to regester as a user.`;

  if (player.username !== username || player.avatar !== avatar) {
    player.username = username;
    player.avatar = avatar;

    await player.save();
  }
};