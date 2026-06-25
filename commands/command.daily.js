const players = require("../Data/data.player");

module.exports = (message) => {
  if(players[message.author.id]){
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
  }
  else{
    message.reply(`
      Please just use (sudo start) to regester as a user.
      `)
  }
};
