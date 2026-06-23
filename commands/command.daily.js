const player = require("../Data/data.player");

module.exports = (message) => {
  const now = Date.now();

  if (player.lastDaily && now - player.lastDaily < 24 * 60 * 60 * 1000) {
    return message.reply("❌ You already claimed your daily reward.");
  }

  const credits = player.credits;
  player.credits = credits + 200;
  player.lastDaily = now

  const XP = player.xp;
  player.xp = XP + 50;
  message.reply(`
🎁 Daily Reward

💰 +200 Credits
📈 +50 XP
`);
};
