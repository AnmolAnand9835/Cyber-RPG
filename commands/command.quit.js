const Player = require("../models/Player");

module.exports = async (message) => {
  const player = await Player.findOneAndDelete({
    userId: message.author.id,
  });

  if (!player) {
    return message.reply("❌ You are not registered.");
  }

  message.reply("✅ You have quit the game.");
};