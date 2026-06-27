const Player = require("../models/Player");
const msg = require("../Data/data.login");

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  } else {
    const now = Date.now();

    if (player.lastDaily && now - player.lastDaily < 24 * 60 * 60 * 1000) {
      return message.reply("❌ You already claimed your daily reward.");
    }

    const credits = player.credits;
    player.credits = credits + 200;
    player.lastDaily = now;

    const XP = player.xp;
    player.xp = XP + 50;

    player.xp += event.xp;

    const xpNeeded = player.level * 100;

    if (player.xp >= xpNeeded) {
      player.xp -= xpNeeded;
      player.level += 1;

      message.reply(
        `🎉 ${message.author} leveled up to Level ${player.level}!`,
      );
    }

    await player.save();
    message.reply(`
🎁 Daily Reward

💰 +200 Credits
📈 +50 XP
`);
  }
  await player.save();
};
