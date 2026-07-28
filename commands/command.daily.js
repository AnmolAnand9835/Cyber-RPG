const Player = require("../models/Player");
const msg = require("../Data/data.login");
let money = 200;
let xp = 50;

module.exports = async (message) => {
  let player = await Player.findOne({
    userId: message.author.id,
  });
  if (!player) {
    message.reply(msg);
  } else {
    const now = Date.now();
    lastDaily = Date.parse(player.lastDaily);
    const COOLDOWN = 24 * 60 * 60 * 1000;

    const remaining = COOLDOWN - (now - lastDaily);

    if (remaining > 0) {
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      return message.reply(
        `❌ You already claimed your daily reward.\nCome back in ${hours}h ${minutes}m ${seconds}s.`,
      );
    }

    const credits = player.credits;
    const hasWifi = player.inventory.some((item) => item.id === "wifi");

    if (hasWifi) {
      money *= 2;
      xp *= 2;
    }
    player.credits = credits + money;
    player.lastDaily = now;

    const XP = player.xp;
    player.xp = XP + xp;

    while (player.xp >= player.level * 100) {
      player.xpNeeded = player.level * 100;
      player.xp -= player.xpNeeded;
      player.level++;

      message.channel.send(
        `🎉 ${message.author} reached Level ${player.level}!`,
      );
    }

    message.reply(`
🎁 Daily Reward

💰 +${money} Credits
📈 +${} XP
`);
    await player.save();
  }
};
