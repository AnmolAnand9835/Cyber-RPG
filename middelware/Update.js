const Player = require('../models/Player')

module.exports = (message) => {
    const username = message.author.username;
const avatar = message.author.displayAvatarURL({
  extension: "png",
  size: 512,
});

if (
  player.username !== username ||
  player.avatar !== avatar
) {
  player.username = username;
  player.avatar = avatar;
  await player.save();
}
}