const player = require('../Data/data.player')

module.exports = (message) => {
  const credits = player.credits
  player.credits = credits + 200
  
  const XP = player.xp 
  player.xp = XP + 50 
  message.reply(`
🎁 Daily Reward

💰 +200 Credits
📈 +50 XP
`);
};